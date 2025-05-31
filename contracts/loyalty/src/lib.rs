#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, Map, BytesN};

/// Loyalty token data structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct LoyaltyToken {
    id: BytesN<32>,
    owner: Address,
    points: i128,
    tier: LoyaltyTier,
    created_at: u64,
    updated_at: u64,
    expiry: u64,
}

/// Loyalty tier enum
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LoyaltyTier {
    Bronze,
    Silver,
    Gold,
    Platinum,
}

/// Subscription status enum
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SubscriptionStatus {
    Active,
    Expired,
    Cancelled,
}

/// Green Saver Pass subscription
#[contracttype]
#[derive(Clone, Debug)]
pub struct Subscription {
    id: BytesN<32>,
    user: Address,
    tier: LoyaltyTier,
    status: SubscriptionStatus,
    start_date: u64,
    end_date: u64,
    auto_renew: bool,
}

/// Loyalty contract for ChopNow Green Saver Pass
#[contract]
pub struct LoyaltyContract;

#[contractimpl]
impl LoyaltyContract {
    /// Initializes the contract with admin
    pub fn initialize(env: Env, admin: Address) {
        // Verify contract is not already initialized
        if env.storage().instance().has(&Symbol::short("admin")) {
            panic!("Contract already initialized");
        }
        
        // Store admin address
        env.storage().instance().set(&Symbol::short("admin"), &admin);
        
        // Initialize empty maps
        env.storage().instance().set(&Symbol::short("tokens"), &Map::<Address, LoyaltyToken>::new(&env));
        env.storage().instance().set(&Symbol::short("subscriptions"), &Map::<Address, Subscription>::new(&env));
        
        // Set tier thresholds
        let mut tier_thresholds = Map::<LoyaltyTier, i128>::new(&env);
        tier_thresholds.set(LoyaltyTier::Bronze, 0);
        tier_thresholds.set(LoyaltyTier::Silver, 100);
        tier_thresholds.set(LoyaltyTier::Gold, 500);
        tier_thresholds.set(LoyaltyTier::Platinum, 1000);
        env.storage().instance().set(&Symbol::short("tier_thresholds"), &tier_thresholds);
        
        // Set subscription prices
        let mut subscription_prices = Map::<LoyaltyTier, i128>::new(&env);
        subscription_prices.set(LoyaltyTier::Bronze, 500); // $5.00
        subscription_prices.set(LoyaltyTier::Silver, 1000); // $10.00
        subscription_prices.set(LoyaltyTier::Gold, 2000); // $20.00
        subscription_prices.set(LoyaltyTier::Platinum, 3000); // $30.00
        env.storage().instance().set(&Symbol::short("subscription_prices"), &subscription_prices);
    }
    
    /// Creates a new loyalty token for a user
    pub fn create_token(env: Env, user: Address, admin: Address) -> LoyaltyToken {
        // Verify admin
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&Symbol::short("admin")).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        // Check if user already has a token
        let tokens = env.storage().instance().get::<Symbol, Map<Address, LoyaltyToken>>(
            &Symbol::short("tokens")
        ).unwrap_or_else(|| Map::new(&env));
        
        if tokens.contains_key(&user) {
            panic!("User already has a loyalty token");
        }
        
        // Create token ID
        let token_id = env.crypto().sha256(&(user.clone(), env.ledger().timestamp()).into_val(&env));
        
        // Create new token
        let now = env.ledger().timestamp();
        let expiry = now + 31536000; // 1 year in seconds
        let token = LoyaltyToken {
            id: token_id,
            owner: user.clone(),
            points: 0,
            tier: LoyaltyTier::Bronze,
            created_at: now,
            updated_at: now,
            expiry,
        };
        
        // Store the token
        let mut tokens_map = tokens;
        tokens_map.set(user.clone(), token.clone());
        env.storage().instance().set(&Symbol::short("tokens"), &tokens_map);
        
        // Emit token created event
        env.events().publish(
            (Symbol::short("token_created"),),
            (token_id, user),
        );
        
        token
    }
    
    /// Adds points to a user's loyalty token
    pub fn add_points(env: Env, user: Address, points: i128, admin: Address) -> LoyaltyToken {
        // Verify admin
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&Symbol::short("admin")).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        // Get user's token
        let mut tokens = env.storage().instance().get::<Symbol, Map<Address, LoyaltyToken>>(
            &Symbol::short("tokens")
        ).unwrap_or_else(|| panic!("No tokens found"));
        
        let mut token = tokens.get(user.clone()).unwrap_or_else(|| panic!("User has no loyalty token"));
        
        // Add points
        token.points += points;
        token.updated_at = env.ledger().timestamp();
        
        // Check if tier upgrade is needed
        let tier_thresholds = env.storage().instance().get::<Symbol, Map<LoyaltyTier, i128>>(
            &Symbol::short("tier_thresholds")
        ).unwrap();
        
        // Determine new tier based on points
        let new_tier = if token.points >= tier_thresholds.get(LoyaltyTier::Platinum).unwrap() {
            LoyaltyTier::Platinum
        } else if token.points >= tier_thresholds.get(LoyaltyTier::Gold).unwrap() {
            LoyaltyTier::Gold
        } else if token.points >= tier_thresholds.get(LoyaltyTier::Silver).unwrap() {
            LoyaltyTier::Silver
        } else {
            LoyaltyTier::Bronze
        };
        
        // Update tier if changed
        if token.tier != new_tier {
            token.tier = new_tier.clone();
            
            // Emit tier change event
            env.events().publish(
                (Symbol::short("tier_changed"),),
                (token.id, user.clone(), new_tier),
            );
        }
        
        // Update storage
        tokens.set(user.clone(), token.clone());
        env.storage().instance().set(&Symbol::short("tokens"), &tokens);
        
        // Emit points added event
        env.events().publish(
            (Symbol::short("points_added"),),
            (token.id, user, points, token.points),
        );
        
        token
    }
    
    /// Redeems points from a user's loyalty token
    pub fn redeem_points(env: Env, user: Address, points: i128) -> LoyaltyToken {
        // Verify user
        user.require_auth();
        
        // Get user's token
        let mut tokens = env.storage().instance().get::<Symbol, Map<Address, LoyaltyToken>>(
            &Symbol::short("tokens")
        ).unwrap_or_else(|| panic!("No tokens found"));
        
        let mut token = tokens.get(user.clone()).unwrap_or_else(|| panic!("User has no loyalty token"));
        
        // Check if user has enough points
        if token.points < points {
            panic!("Not enough points");
        }
        
        // Deduct points
        token.points -= points;
        token.updated_at = env.ledger().timestamp();
        
        // Check if tier downgrade is needed
        let tier_thresholds = env.storage().instance().get::<Symbol, Map<LoyaltyTier, i128>>(
            &Symbol::short("tier_thresholds")
        ).unwrap();
        
        // Determine new tier based on points
        let new_tier = if token.points >= tier_thresholds.get(LoyaltyTier::Platinum).unwrap() {
            LoyaltyTier::Platinum
        } else if token.points >= tier_thresholds.get(LoyaltyTier::Gold).unwrap() {
            LoyaltyTier::Gold
        } else if token.points >= tier_thresholds.get(LoyaltyTier::Silver).unwrap() {
            LoyaltyTier::Silver
        } else {
            LoyaltyTier::Bronze
        };
        
        // Update tier if changed
        if token.tier != new_tier {
            token.tier = new_tier.clone();
            
            // Emit tier change event
            env.events().publish(
                (Symbol::short("tier_changed"),),
                (token.id, user.clone(), new_tier),
            );
        }
        
        // Update storage
        tokens.set(user.clone(), token.clone());
        env.storage().instance().set(&Symbol::short("tokens"), &tokens);
        
        // Emit points redeemed event
        env.events().publish(
            (Symbol::short("points_redeemed"),),
            (token.id, user, points, token.points),
        );
        
        token
    }
    
    /// Creates a new Green Saver Pass subscription
    pub fn create_subscription(
        env: Env,
        user: Address,
        tier: LoyaltyTier,
        auto_renew: bool,
        admin: Address,
    ) -> Subscription {
        // Verify admin
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&Symbol::short("admin")).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        // Check if user already has a subscription
        let subscriptions = env.storage().instance().get::<Symbol, Map<Address, Subscription>>(
            &Symbol::short("subscriptions")
        ).unwrap_or_else(|| Map::new(&env));
        
        if subscriptions.contains_key(&user) {
            let existing = subscriptions.get(user.clone()).unwrap();
            if existing.status == SubscriptionStatus::Active {
                panic!("User already has an active subscription");
            }
        }
        
        // Create subscription ID
        let subscription_id = env.crypto().sha256(&(user.clone(), env.ledger().timestamp()).into_val(&env));
        
        // Set subscription dates
        let now = env.ledger().timestamp();
        let end_date = now + 2592000; // 30 days in seconds
        
        // Create new subscription
        let subscription = Subscription {
            id: subscription_id,
            user: user.clone(),
            tier: tier.clone(),
            status: SubscriptionStatus::Active,
            start_date: now,
            end_date,
            auto_renew,
        };
        
        // Store the subscription
        let mut subscriptions_map = subscriptions;
        subscriptions_map.set(user.clone(), subscription.clone());
        env.storage().instance().set(&Symbol::short("subscriptions"), &subscriptions_map);
        
        // Emit subscription created event
        env.events().publish(
            (Symbol::short("subscription_created"),),
            (subscription_id, user, tier),
        );
        
        subscription
    }
    
    /// Renews a Green Saver Pass subscription
    pub fn renew_subscription(env: Env, user: Address, admin: Address) -> Subscription {
        // Verify admin
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&Symbol::short("admin")).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        // Get user's subscription
        let mut subscriptions = env.storage().instance().get::<Symbol, Map<Address, Subscription>>(
            &Symbol::short("subscriptions")
        ).unwrap_or_else(|| panic!("No subscriptions found"));
        
        let mut subscription = subscriptions.get(user.clone()).unwrap_or_else(|| panic!("User has no subscription"));
        
        // Check if subscription is renewable
        if subscription.status == SubscriptionStatus::Cancelled {
            panic!("Cannot renew cancelled subscription");
        }
        
        // Set new dates
        let now = env.ledger().timestamp();
        let new_end_date = if now > subscription.end_date {
            // If expired, start from now
            now + 2592000 // 30 days in seconds
        } else {
            // If still active, extend from current end date
            subscription.end_date + 2592000 // 30 days in seconds
        };
        
        // Update subscription
        subscription.status = SubscriptionStatus::Active;
        subscription.end_date = new_end_date;
        
        // Update storage
        subscriptions.set(user.clone(), subscription.clone());
        env.storage().instance().set(&Symbol::short("subscriptions"), &subscriptions);
        
        // Emit subscription renewed event
        env.events().publish(
            (Symbol::short("subscription_renewed"),),
            (subscription.id, user, new_end_date),
        );
        
        subscription
    }
    
    /// Cancels a Green Saver Pass subscription
    pub fn cancel_subscription(env: Env, user: Address) -> Subscription {
        // Verify user
        user.require_auth();
        
        // Get user's subscription
        let mut subscriptions = env.storage().instance().get::<Symbol, Map<Address, Subscription>>(
            &Symbol::short("subscriptions")
        ).unwrap_or_else(|| panic!("No subscriptions found"));
        
        let mut subscription = subscriptions.get(user.clone()).unwrap_or_else(|| panic!("User has no subscription"));
        
        // Check if subscription is active
        if subscription.status != SubscriptionStatus::Active {
            panic!("Subscription is not active");
        }
        
        // Update subscription
        subscription.status = SubscriptionStatus::Cancelled;
        subscription.auto_renew = false;
        
        // Update storage
        subscriptions.set(user.clone(), subscription.clone());
        env.storage().instance().set(&Symbol::short("subscriptions"), &subscriptions);
        
        // Emit subscription cancelled event
        env.events().publish(
            (Symbol::short("subscription_cancelled"),),
            (subscription.id, user),
        );
        
        subscription
    }
    
    /// Gets a user's loyalty token
    pub fn get_token(env: Env, user: Address) -> LoyaltyToken {
        let tokens = env.storage().instance().get::<Symbol, Map<Address, LoyaltyToken>>(
            &Symbol::short("tokens")
        ).unwrap_or_else(|| panic!("No tokens found"));
        
        tokens.get(user).unwrap_or_else(|| panic!("User has no loyalty token"))
    }
    
    /// Gets a user's subscription
    pub fn get_subscription(env: Env, user: Address) -> Subscription {
        let subscriptions = env.storage().instance().get::<Symbol, Map<Address, Subscription>>(
            &Symbol::short("subscriptions")
        ).unwrap_or_else(|| panic!("No subscriptions found"));
        
        subscriptions.get(user).unwrap_or_else(|| panic!("User has no subscription"))
    }
    
    /// Checks if a user's subscription is active
    pub fn is_subscription_active(env: Env, user: Address) -> bool {
        let subscriptions = env.storage().instance().get::<Symbol, Map<Address, Subscription>>(
            &Symbol::short("subscriptions")
        ).unwrap_or_else(|| Map::new(&env));
        
        if !subscriptions.contains_key(&user) {
            return false;
        }
        
        let subscription = subscriptions.get(user).unwrap();
        let now = env.ledger().timestamp();
        
        subscription.status == SubscriptionStatus::Active && now <= subscription.end_date
    }
    
    /// Gets the price for a subscription tier
    pub fn get_subscription_price(env: Env, tier: LoyaltyTier) -> i128 {
        let subscription_prices = env.storage().instance().get::<Symbol, Map<LoyaltyTier, i128>>(
            &Symbol::short("subscription_prices")
        ).unwrap();
        
        subscription_prices.get(tier).unwrap()
    }
}
