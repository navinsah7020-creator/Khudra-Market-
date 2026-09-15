# Khudra Market Clothing Website

## What is included
- Clothing storefront
- Men / Women / Kids categories
- Product search
- Size and color selection
- Cart and checkout
- COD checkout
- Orders database
- Admin-ready product database
- eSewa/Khalti payment method fields (real gateway verification still requires merchant credentials)

## Setup
1. Create a Supabase project.
2. Supabase Dashboard -> SQL Editor -> paste and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Put your Supabase URL and publishable/anon key in `.env.local`.
5. Run `npm install`.
6. Run `npm run dev`.
7. Deploy to Vercel and add the same environment variables.

## Production payment
The checkout records eSewa/Khalti as the selected method but does not fake successful payment. For real payments, obtain merchant credentials and implement server-side initiation + callback/IPN verification using the official eSewa/Khalti documentation.

## Production security
Before public launch, add Supabase Auth for `/admin`, create an admin role, and tighten RLS so only admins can update products/orders.