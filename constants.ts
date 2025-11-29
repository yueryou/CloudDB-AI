import { Connection, DbType } from './types';

export const MOCK_CONNECTIONS: Connection[] = [
  {
    id: '1',
    name: 'Production DB',
    type: DbType.POSTGRES,
    host: 'db-prod.internal:5432',
    status: 'connected',
    schema: {
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'uuid', isPrimaryKey: true },
            { name: 'email', type: 'varchar(255)' },
            { name: 'full_name', type: 'varchar(100)' },
            { name: 'created_at', type: 'timestamp' },
            { name: 'status', type: 'varchar(20)' }
          ]
        },
        {
          name: 'orders',
          columns: [
            { name: 'id', type: 'uuid', isPrimaryKey: true },
            { name: 'user_id', type: 'uuid', isForeignKey: true },
            { name: 'total_amount', type: 'decimal(10,2)' },
            { name: 'status', type: 'varchar(20)' },
            { name: 'created_at', type: 'timestamp' }
          ]
        },
        {
          name: 'products',
          columns: [
            { name: 'id', type: 'uuid', isPrimaryKey: true },
            { name: 'name', type: 'varchar(200)' },
            { name: 'inventory_count', type: 'integer' },
            { name: 'price', type: 'decimal(10,2)' }
          ]
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Analytics Store',
    type: DbType.MYSQL,
    host: 'analytics-replica:3306',
    status: 'connected',
    schema: {
      tables: [
        {
          name: 'events',
          columns: [
            { name: 'id', type: 'bigint', isPrimaryKey: true },
            { name: 'event_type', type: 'varchar(50)' },
            { name: 'payload', type: 'json' },
            { name: 'timestamp', type: 'datetime' }
          ]
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Cache Layer',
    type: DbType.REDIS,
    host: 'redis-cluster:6379',
    status: 'disconnected',
    schema: { tables: [] } // Redis is key-value, simplified here
  }
];