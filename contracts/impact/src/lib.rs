#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, Map, BytesN};

/// Impact metric types
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ImpactMetricType {
    MealsSaved,
    CO2Reduced,
    WaterConserved,
    MoneyDonated,
}

/// Impact event data structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct ImpactEvent {
    id: BytesN<32>,
    user: Address,
    vendor: Option<Address>,
    metric_type: ImpactMetricType,
    amount: i128,
    timestamp: u64,
    order_id: Option<BytesN<32>>,
}

/// User impact summary
#[contracttype]
#[derive(Clone, Debug)]
pub struct UserImpactSummary {
    user: Address,
    meals_saved: i128,
    co2_reduced: i128,
    water_conserved: i128,
    money_donated: i128,
    last_updated: u64,
}

/// Global impact summary
#[contracttype]
#[derive(Clone, Debug)]
pub struct GlobalImpactSummary {
    meals_saved: i128,
    co2_reduced: i128,
    water_conserved: i128,
    money_donated: i128,
    total_users: i128,
    total_vendors: i128,
    last_updated: u64,
}

/// Impact tracking contract for ChopNow
#[contract]
pub struct ImpactContract;

#[contractimpl]
impl ImpactContract {
    /// Initializes the contract with admin
    pub fn initialize(env: Env, admin: Address) {
        // Verify contract is not already initialized
        if env.storage().instance().has(&Symbol::short("admin")) {
            panic!("Contract already initialized");
        }
        
        // Store admin address
        env.storage().instance().set(&Symbol::short("admin"), &admin);
        
        // Initialize empty maps
        env.storage().instance().set(&Symbol::short("events"), &Vec::<ImpactEvent>::new(&env));
        env.storage().instance().set(&Symbol::short("user_summaries"), &Map::<Address, UserImpactSummary>::new(&env));
        
        // Initialize global summary
        let global_summary = GlobalImpactSummary {
            meals_saved: 0,
            co2_reduced: 0,
            water_conserved: 0,
            money_donated: 0,
            total_users: 0,
            total_vendors: 0,
            last_updated: env.ledger().timestamp(),
        };
        env.storage().instance().set(&Symbol::short("global_summary"), &global_summary);
        
        // Set conversion factors
        let mut conversion_factors = Map::<Symbol, i128>::new(&env);
        // 1 meal saved = 1.2 kg CO2 reduced
        conversion_factors.set(Symbol::short("meal_to_co2"), 120);
        // 1 meal saved = 1000 liters water conserved
        conversion_factors.set(Symbol::short("meal_to_water"), 100000);
        env.storage().instance().set(&Symbol::short("conversion_factors"), &conversion_factors);
    }
    
    /// Records a new impact event
    pub fn record_impact(
        env: Env,
        user: Address,
        vendor: Option<Address>,
        metric_type: ImpactMetricType,
        amount: i128,
        order_id: Option<BytesN<32>>,
        admin: Address,
    ) -> ImpactEvent {
        // Verify admin
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&Symbol::short("admin")).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        // Create event ID
        let event_id = env.crypto().sha256(&(
            user.clone(),
            metric_type.clone(),
            env.ledger().timestamp()
        ).into_val(&env));
        
        // Create new impact event
        let now = env.ledger().timestamp();
        let event = ImpactEvent {
            id: event_id,
            user: user.clone(),
            vendor,
            metric_type: metric_type.clone(),
            amount,
            timestamp: now,
            order_id,
        };
        
        // Store the event
        let mut events = env.storage().instance().get::<Symbol, Vec<ImpactEvent>>(
            &Symbol::short("events")
        ).unwrap_or_else(|| Vec::new(&env));
        
        events.push_back(event.clone());
        env.storage().instance().set(&Symbol::short("events"), &events);
        
        // Update user summary
        let mut user_summaries = env.storage().instance().get::<Symbol, Map<Address, UserImpactSummary>>(
            &Symbol::short("user_summaries")
        ).unwrap_or_else(|| Map::new(&env));
        
        let mut user_summary = if user_summaries.contains_key(&user) {
            user_summaries.get(user.clone()).unwrap()
        } else {
            // Create new user summary if it doesn't exist
            UserImpactSummary {
                user: user.clone(),
                meals_saved: 0,
                co2_reduced: 0,
                water_conserved: 0,
                money_donated: 0,
                last_updated: now,
            }
        };
        
        // Update the appropriate metric
        match metric_type {
            ImpactMetricType::MealsSaved => {
                user_summary.meals_saved += amount;
                
                // Calculate derived metrics using conversion factors
                let conversion_factors = env.storage().instance().get::<Symbol, Map<Symbol, i128>>(
                    &Symbol::short("conversion_factors")
                ).unwrap();
                
                let co2_factor = conversion_factors.get(Symbol::short("meal_to_co2")).unwrap();
                let water_factor = conversion_factors.get(Symbol::short("meal_to_water")).unwrap();
                
                user_summary.co2_reduced += (amount * co2_factor) / 100; // Divide by 100 to account for decimal places
                user_summary.water_conserved += (amount * water_factor) / 100;
            },
            ImpactMetricType::CO2Reduced => {
                user_summary.co2_reduced += amount;
            },
            ImpactMetricType::WaterConserved => {
                user_summary.water_conserved += amount;
            },
            ImpactMetricType::MoneyDonated => {
                user_summary.money_donated += amount;
            },
        }
        
        user_summary.last_updated = now;
        user_summaries.set(user.clone(), user_summary);
        env.storage().instance().set(&Symbol::short("user_summaries"), &user_summaries);
        
        // Update global summary
        let mut global_summary: GlobalImpactSummary = env.storage().instance().get(
            &Symbol::short("global_summary")
        ).unwrap();
        
        match metric_type {
            ImpactMetricType::MealsSaved => {
                global_summary.meals_saved += amount;
                
                // Calculate derived metrics using conversion factors
                let conversion_factors = env.storage().instance().get::<Symbol, Map<Symbol, i128>>(
                    &Symbol::short("conversion_factors")
                ).unwrap();
                
                let co2_factor = conversion_factors.get(Symbol::short("meal_to_co2")).unwrap();
                let water_factor = conversion_factors.get(Symbol::short("meal_to_water")).unwrap();
                
                global_summary.co2_reduced += (amount * co2_factor) / 100;
                global_summary.water_conserved += (amount * water_factor) / 100;
            },
            ImpactMetricType::CO2Reduced => {
                global_summary.co2_reduced += amount;
            },
            ImpactMetricType::WaterConserved => {
                global_summary.water_conserved += amount;
            },
            ImpactMetricType::MoneyDonated => {
                global_summary.money_donated += amount;
            },
        }
        
        global_summary.last_updated = now;
        env.storage().instance().set(&Symbol::short("global_summary"), &global_summary);
        
        // Emit impact recorded event
        env.events().publish(
            (Symbol::short("impact_recorded"),),
            (event_id, user, metric_type, amount),
        );
        
        event
    }
    
    /// Gets a user's impact summary
    pub fn get_user_impact(env: Env, user: Address) -> UserImpactSummary {
        let user_summaries = env.storage().instance().get::<Symbol, Map<Address, UserImpactSummary>>(
            &Symbol::short("user_summaries")
        ).unwrap_or_else(|| Map::new(&env));
        
        if !user_summaries.contains_key(&user) {
            // Return empty summary if user has no impact yet
            return UserImpactSummary {
                user: user.clone(),
                meals_saved: 0,
                co2_reduced: 0,
                water_conserved: 0,
                money_donated: 0,
                last_updated: env.ledger().timestamp(),
            };
        }
        
        user_summaries.get(user).unwrap()
    }
    
    /// Gets the global impact summary
    pub fn get_global_impact(env: Env) -> GlobalImpactSummary {
        env.storage().instance().get(&Symbol::short("global_summary")).unwrap()
    }
    
    /// Gets a user's impact events
    pub fn get_user_events(env: Env, user: Address, limit: u32) -> Vec<ImpactEvent> {
        let events = env.storage().instance().get::<Symbol, Vec<ImpactEvent>>(
            &Symbol::short("events")
        ).unwrap_or_else(|| Vec::new(&env));
        
        let mut user_events = Vec::new(&env);
        let mut count = 0;
        
        // Iterate through events in reverse order (newest first)
        for i in (0..events.len()).rev() {
            if count >= limit {
                break;
            }
            
            let event = events.get(i).unwrap();
            if event.user == user {
                user_events.push_back(event);
                count += 1;
            }
        }
        
        user_events
    }
    
    /// Updates the conversion factors
    pub fn update_conversion_factors(
        env: Env,
        meal_to_co2: i128,
        meal_to_water: i128,
        admin: Address,
    ) {
        // Verify admin
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&Symbol::short("admin")).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        // Update conversion factors
        let mut conversion_factors = env.storage().instance().get::<Symbol, Map<Symbol, i128>>(
            &Symbol::short("conversion_factors")
        ).unwrap();
        
        conversion_factors.set(Symbol::short("meal_to_co2"), meal_to_co2);
        conversion_factors.set(Symbol::short("meal_to_water"), meal_to_water);
        
        env.storage().instance().set(&Symbol::short("conversion_factors"), &conversion_factors);
        
        // Emit conversion factors updated event
        env.events().publish(
            (Symbol::short("conversion_factors_updated"),),
            (meal_to_co2, meal_to_water),
        );
    }
}
