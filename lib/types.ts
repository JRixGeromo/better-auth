export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          id: string;
          checksum: string;
          finished_at: string | null;
          migration_name: string;
          logs: string | null;
          rolled_back_at: string | null;
          started_at: string;
          applied_steps_count: number;
        };
        Insert: {
          id?: string;
          checksum: string;
          finished_at?: string | null;
          migration_name: string;
          logs?: string | null;
          rolled_back_at?: string | null;
          started_at?: string;
          applied_steps_count?: number;
        };
        Update: {
          id?: string;
          checksum?: string;
          finished_at?: string | null;
          migration_name?: string;
          logs?: string | null;
          rolled_back_at?: string | null;
          started_at?: string;
          applied_steps_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      exec: {
        Args: {
          sql: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
