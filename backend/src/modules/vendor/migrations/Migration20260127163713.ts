import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260127163713 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "vendor" ("id" text not null, "name" text not null, "description" text null, "email" text not null, "phone" text null, "logo_url" text null, "status" text check ("status" in ('pending', 'verified', 'premium', 'suspended')) not null default 'pending', "commission_rate" real not null default 0.15, "business_registration" text null, "bank_account" text null, "address_line_1" text null, "address_line_2" text null, "city" text null, "postal_code" text null, "country_code" text not null default 'kw', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_pkey" primary key ("id"), constraint email_format_check check (email LIKE '%@%'));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at" ON "vendor" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "vendor" cascade;`);
  }

}
