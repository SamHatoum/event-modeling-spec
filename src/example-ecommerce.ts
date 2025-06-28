import type { EventModel, StateChange, StateView, Automation, Translation } from './event-modeling-schema';
import { EventModelSchema } from './event-modeling-schema';

export const ecommerceEventModel: EventModel = {
  name: "E-Commerce System",
  version: "1.0.0",
  description: "Event Model for an e-commerce platform handling customers, orders, inventory, and payments",
  slices: [
    {
      type: 'stateChange',
      name: 'Customer Registration',
      context: 'Allows new customers to create an account in the system',
      trigger: {
        source: 'ui',
        description: 'Customer fills out registration form'
      },
      stream: 'customer-{customerId}',
      command: 'RegisterCustomer',
      events: ['CustomerRegistered'],
      invariants: ['Email must be unique across all customers'],
      businessRules: [
        {
          given: [],
          when: {
            type: 'command',
            name: 'RegisterCustomer',
            exampleData: {
              customerId: '123e4567-e89b-12d3-a456-426614174000',
              email: 'john.doe@example.com',
              firstName: 'John',
              lastName: 'Doe',
              password: 'hashed_password_123'
            }
          },
          then: [
            {
              type: 'event',
              name: 'CustomerRegistered',
              exampleData: {
                customerId: '123e4567-e89b-12d3-a456-426614174000',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                registeredAt: '2024-01-15T10:30:00Z'
              }
            }
          ]
        }
      ]
    } satisfies StateChange,
    {
      type: 'stateChange',
      name: 'Place Order',
      context: 'Customer places an order for products',
      trigger: {
        source: 'ui',
        description: 'Customer completes checkout process'
      },
      stream: 'order-{orderId}',
      command: 'PlaceOrder',
      events: ['OrderPlaced', 'InventoryReserved'],
      invariants: [
        'All items must be in stock',
        'Customer must have valid payment method'
      ],
      businessRules: [
        {
          given: [
            {
              eventName: 'ProductAddedToInventory',
              exampleData: { productId: 'PROD-001', quantity: 100 }
            }
          ],
          when: {
            type: 'command',
            name: 'PlaceOrder',
            exampleData: {
              orderId: 'ORD-2024-001',
              customerId: '123e4567-e89b-12d3-a456-426614174000',
              items: [
                { productId: 'PROD-001', quantity: 2, price: 29.99 }
              ],
              totalAmount: 59.98
            }
          },
          then: [
            {
              type: 'event',
              name: 'OrderPlaced',
              exampleData: {
                orderId: 'ORD-2024-001',
                customerId: '123e4567-e89b-12d3-a456-426614174000',
                items: [
                  { productId: 'PROD-001', quantity: 2, price: 29.99 }
                ],
                totalAmount: 59.98,
                placedAt: '2024-01-15T14:30:00Z'
              }
            },
            {
              type: 'event',
              name: 'InventoryReserved',
              exampleData: {
                orderId: 'ORD-2024-001',
                productId: 'PROD-001',
                quantity: 2
              }
            }
          ]
        }
      ]
    } satisfies StateChange,
    {
      type: 'stateView',
      name: 'Customer Profile',
      context: 'Displays customer information and order history',
      trigger: {
        source: 'ui',
        description: 'Customer views their profile page'
      },
      events: ['CustomerRegistered', 'CustomerUpdated', 'OrderPlaced'],
      businessRules: [
        {
          given: [
            {
              eventName: 'CustomerRegistered',
              exampleData: {
                customerId: '123e4567-e89b-12d3-a456-426614174000',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe'
              }
            },
            {
              eventName: 'OrderPlaced',
              exampleData: {
                orderId: 'ORD-2024-001',
                customerId: '123e4567-e89b-12d3-a456-426614174000',
                totalAmount: 59.98
              }
            }
          ],
          when: {
            type: 'command',
            name: 'GetCustomerProfile',
            exampleData: {
              customerId: '123e4567-e89b-12d3-a456-426614174000'
            }
          },
          then: [
            {
              type: 'state',
              name: 'CustomerProfile',
              exampleData: {
                customerId: '123e4567-e89b-12d3-a456-426614174000',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                totalOrders: 1,
                totalSpent: 59.98,
                lastOrderDate: '2024-01-15T14:30:00Z'
              }
            }
          ]
        }
      ]
    } satisfies StateView,
    {
      type: 'stateView',
      name: 'Inventory Status',
      context: 'Real-time view of product availability',
      trigger: {
        source: 'api',
        description: 'System queries current inventory levels'
      },
      events: ['ProductAddedToInventory', 'InventoryReserved', 'InventoryReleased'],
      businessRules: [
        {
          given: [
            {
              eventName: 'ProductAddedToInventory',
              exampleData: { productId: 'PROD-001', quantity: 100 }
            },
            {
              eventName: 'InventoryReserved',
              exampleData: { productId: 'PROD-001', quantity: 2 }
            }
          ],
          when: {
            type: 'command',
            name: 'GetInventoryStatus',
            exampleData: { productId: 'PROD-001' }
          },
          then: [
            {
              type: 'state',
              name: 'InventoryStatus',
              exampleData: {
                productId: 'PROD-001',
                availableQuantity: 98,
                reservedQuantity: 2,
                totalQuantity: 100
              }
            }
          ]
        }
      ]
    } satisfies StateView,
    {
      type: 'automation',
      name: 'Order Fulfillment',
      context: 'Automatically process paid orders for shipment',
      trigger: {
        type: 'event',
        events: ['PaymentReceived']
      },
      commands: ['FulfillOrder', 'CreateShipment'],
      businessRules: [
        {
          given: [
            {
              eventName: 'OrderPlaced',
              exampleData: { orderId: 'ORD-2024-001', status: 'pending_payment' }
            }
          ],
          when: {
            type: 'command',
            name: 'ProcessPayment',
            exampleData: {
              orderId: 'ORD-2024-001',
              amount: 59.98,
              paymentMethod: 'credit_card'
            }
          },
          then: [
            {
              type: 'event',
              name: 'PaymentReceived',
              exampleData: {
                orderId: 'ORD-2024-001',
                amount: 59.98,
                transactionId: 'TXN-123456'
              }
            },
            {
              type: 'event',
              name: 'OrderFulfillmentStarted',
              exampleData: {
                orderId: 'ORD-2024-001',
                warehouseId: 'WH-001'
              }
            }
          ]
        }
      ]
    } satisfies Automation,
    {
      type: 'automation',
      name: 'Low Stock Alert',
      context: 'Monitor inventory levels and create reorder tasks',
      trigger: {
        type: 'schedule',
        schedule: '0 */6 * * *'
      },
      commands: ['CheckInventoryLevels', 'CreateReorderTask'],
      businessRules: [
        {
          given: [
            {
              eventName: 'InventoryLevelChecked',
              exampleData: {
                productId: 'PROD-001',
                currentLevel: 10,
                reorderPoint: 20
              }
            }
          ],
          when: {
            type: 'command',
            name: 'CheckInventoryLevels'
          },
          then: [
            {
              type: 'event',
              name: 'LowStockDetected',
              exampleData: {
                productId: 'PROD-001',
                currentLevel: 10,
                reorderPoint: 20,
                suggestedQuantity: 100
              }
            }
          ]
        }
      ]
    } satisfies Automation,
    {
      type: 'translation',
      name: 'Payment Gateway Events',
      context: 'Translate external payment provider webhooks to internal events',
      source: 'Stripe',
      externalEvent: 'payment_intent.succeeded',
      internalEvents: ['PaymentReceived', 'PaymentMethodSaved'],
      businessRules: [
        {
          given: [],
          when: {
            type: 'command',
            name: 'ReceiveStripeWebhook',
            exampleData: {
              type: 'payment_intent.succeeded',
              data: {
                object: {
                  id: 'pi_1234567890',
                  amount: 5998,
                  metadata: {
                    orderId: 'ORD-2024-001'
                  }
                }
              }
            }
          },
          then: [
            {
              type: 'event',
              name: 'PaymentReceived',
              exampleData: {
                orderId: 'ORD-2024-001',
                amount: 59.98,
                transactionId: 'pi_1234567890',
                provider: 'Stripe'
              }
            }
          ]
        }
      ]
    } satisfies Translation,
    {
      type: 'translation',
      name: 'Shipping Provider Updates',
      context: 'Translate shipping provider tracking updates to internal events',
      source: 'FedEx',
      externalEvent: 'shipment.status.updated',
      internalEvents: ['ShipmentStatusUpdated', 'OrderDelivered'],
      businessRules: [
        {
          given: [
            {
              eventName: 'ShipmentCreated',
              exampleData: {
                orderId: 'ORD-2024-001',
                trackingNumber: 'FX123456789'
              }
            }
          ],
          when: {
            type: 'command',
            name: 'ReceiveFedExWebhook',
            exampleData: {
              trackingNumber: 'FX123456789',
              status: 'delivered',
              timestamp: '2024-01-17T16:30:00Z'
            }
          },
          then: [
            {
              type: 'event',
              name: 'OrderDelivered',
              exampleData: {
                orderId: 'ORD-2024-001',
                trackingNumber: 'FX123456789',
                deliveredAt: '2024-01-17T16:30:00Z'
              }
            }
          ]
        }
      ]
    } satisfies Translation
  ],
  metadata: {
    authors: ['Event Modeling Team']
  }
};

console.log(`${EventModelSchema.parse(ecommerceEventModel).name} is valid!`); 