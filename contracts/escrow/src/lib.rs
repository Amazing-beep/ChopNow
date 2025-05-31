#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, Map, BytesN};

/// Order status enum
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum OrderStatus {
    Created,
    Paid,
    ReadyForPickup,
    Completed,
    Cancelled,
    Refunded,
}

/// Order data structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Order {
    id: BytesN<32>,
    buyer: Address,
    vendor: Address,
    amount: i128,
    status: OrderStatus,
    created_at: u64,
    updated_at: u64,
}

/// Escrow contract for ChopNow orders
#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Creates a new order in escrow
    pub fn create_order(
        env: Env,
        order_id: BytesN<32>,
        buyer: Address,
        vendor: Address,
        amount: i128,
    ) -> Order {
        // Verify inputs
        buyer.require_auth();
        
        // Check if order already exists
        let orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| Map::new(&env));
        
        if orders.contains_key(&order_id) {
            panic!("Order already exists");
        }
        
        // Create new order
        let now = env.ledger().timestamp();
        let order = Order {
            id: order_id.clone(),
            buyer: buyer.clone(),
            vendor: vendor.clone(),
            amount,
            status: OrderStatus::Created,
            created_at: now,
            updated_at: now,
        };
        
        // Store the order
        let mut orders_map = orders;
        orders_map.set(order_id, order.clone());
        env.storage().instance().set(&Symbol::short("orders"), &orders_map);
        
        // Emit order created event
        env.events().publish(
            (Symbol::short("order_created"),),
            (order_id, buyer, vendor, amount),
        );
        
        order
    }
    
    /// Processes payment for an order
    pub fn pay_order(
        env: Env,
        order_id: BytesN<32>,
        buyer: Address,
    ) -> Order {
        // Verify inputs
        buyer.require_auth();
        
        // Get the order
        let mut orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| panic!("No orders found"));
        
        let mut order = orders.get(order_id.clone()).unwrap_or_else(|| panic!("Order not found"));
        
        // Verify buyer
        if order.buyer != buyer {
            panic!("Not the buyer of this order");
        }
        
        // Verify order status
        if order.status != OrderStatus::Created {
            panic!("Order is not in Created status");
        }
        
        // Update order status
        order.status = OrderStatus::Paid;
        order.updated_at = env.ledger().timestamp();
        
        // Update storage
        orders.set(order_id.clone(), order.clone());
        env.storage().instance().set(&Symbol::short("orders"), &orders);
        
        // Emit payment event
        env.events().publish(
            (Symbol::short("order_paid"),),
            (order_id, buyer, order.amount),
        );
        
        order
    }
    
    /// Marks an order as ready for pickup
    pub fn ready_for_pickup(
        env: Env,
        order_id: BytesN<32>,
        vendor: Address,
    ) -> Order {
        // Verify inputs
        vendor.require_auth();
        
        // Get the order
        let mut orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| panic!("No orders found"));
        
        let mut order = orders.get(order_id.clone()).unwrap_or_else(|| panic!("Order not found"));
        
        // Verify vendor
        if order.vendor != vendor {
            panic!("Not the vendor of this order");
        }
        
        // Verify order status
        if order.status != OrderStatus::Paid {
            panic!("Order is not in Paid status");
        }
        
        // Update order status
        order.status = OrderStatus::ReadyForPickup;
        order.updated_at = env.ledger().timestamp();
        
        // Update storage
        orders.set(order_id.clone(), order.clone());
        env.storage().instance().set(&Symbol::short("orders"), &orders);
        
        // Emit ready for pickup event
        env.events().publish(
            (Symbol::short("order_ready"),),
            (order_id, vendor),
        );
        
        order
    }
    
    /// Completes an order and releases funds to vendor
    pub fn complete_order(
        env: Env,
        order_id: BytesN<32>,
        buyer: Address,
    ) -> Order {
        // Verify inputs
        buyer.require_auth();
        
        // Get the order
        let mut orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| panic!("No orders found"));
        
        let mut order = orders.get(order_id.clone()).unwrap_or_else(|| panic!("Order not found"));
        
        // Verify buyer
        if order.buyer != buyer {
            panic!("Not the buyer of this order");
        }
        
        // Verify order status
        if order.status != OrderStatus::ReadyForPickup {
            panic!("Order is not ready for pickup");
        }
        
        // Update order status
        order.status = OrderStatus::Completed;
        order.updated_at = env.ledger().timestamp();
        
        // Update storage
        orders.set(order_id.clone(), order.clone());
        env.storage().instance().set(&Symbol::short("orders"), &orders);
        
        // Emit completion event
        env.events().publish(
            (Symbol::short("order_completed"),),
            (order_id, buyer, order.vendor, order.amount),
        );
        
        // In a real implementation, this would trigger a transfer of funds to the vendor
        // This would require integration with the Stellar token contract
        
        order
    }
    
    /// Cancels an order and refunds the buyer
    pub fn cancel_order(
        env: Env,
        order_id: BytesN<32>,
        caller: Address,
    ) -> Order {
        // Verify inputs
        caller.require_auth();
        
        // Get the order
        let mut orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| panic!("No orders found"));
        
        let mut order = orders.get(order_id.clone()).unwrap_or_else(|| panic!("Order not found"));
        
        // Verify caller is either buyer or vendor
        if order.buyer != caller && order.vendor != caller {
            panic!("Not authorized to cancel this order");
        }
        
        // Verify order status
        if order.status == OrderStatus::Completed || order.status == OrderStatus::Refunded {
            panic!("Order cannot be cancelled in its current state");
        }
        
        // Update order status
        order.status = OrderStatus::Cancelled;
        order.updated_at = env.ledger().timestamp();
        
        // Update storage
        orders.set(order_id.clone(), order.clone());
        env.storage().instance().set(&Symbol::short("orders"), &orders);
        
        // Emit cancellation event
        env.events().publish(
            (Symbol::short("order_cancelled"),),
            (order_id, caller),
        );
        
        // If order was paid, initiate refund
        if order.status == OrderStatus::Paid || order.status == OrderStatus::ReadyForPickup {
            // In a real implementation, this would trigger a refund to the buyer
            // This would require integration with the Stellar token contract
            order.status = OrderStatus::Refunded;
            orders.set(order_id.clone(), order.clone());
            env.storage().instance().set(&Symbol::short("orders"), &orders);
            
            env.events().publish(
                (Symbol::short("order_refunded"),),
                (order_id, order.buyer, order.amount),
            );
        }
        
        order
    }
    
    /// Gets an order by ID
    pub fn get_order(env: Env, order_id: BytesN<32>) -> Order {
        let orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| panic!("No orders found"));
        
        orders.get(order_id).unwrap_or_else(|| panic!("Order not found"))
    }
    
    /// Gets all orders for a buyer
    pub fn get_buyer_orders(env: Env, buyer: Address) -> Vec<Order> {
        let orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| Map::new(&env));
        
        let mut buyer_orders = Vec::new(&env);
        for (_, order) in orders.iter() {
            if order.buyer == buyer {
                buyer_orders.push_back(order);
            }
        }
        
        buyer_orders
    }
    
    /// Gets all orders for a vendor
    pub fn get_vendor_orders(env: Env, vendor: Address) -> Vec<Order> {
        let orders = env.storage().instance().get::<Symbol, Map<BytesN<32>, Order>>(
            &Symbol::short("orders")
        ).unwrap_or_else(|| Map::new(&env));
        
        let mut vendor_orders = Vec::new(&env);
        for (_, order) in orders.iter() {
            if order.vendor == vendor {
                vendor_orders.push_back(order);
            }
        }
        
        vendor_orders
    }
}
