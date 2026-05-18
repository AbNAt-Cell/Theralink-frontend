import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// This endpoint uses the service_role key to create users via Supabase Admin API
// It should only be called by authenticated admins
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, clinicId } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: role || 'CLIENT',
      },
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Update the profile with clinic_id and email (the trigger should have already created the profile)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        clinic_id: clinicId || null,
        email: email,
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      // User was created but profile update failed — not critical, can be fixed later
    }

    // 3. If CLIENT role, also create client_details row
    if ((role || 'CLIENT') === 'CLIENT') {
      const { error: detailsError } = await supabaseAdmin
        .from('client_details')
        .insert({ profile_id: userId });

      if (detailsError) {
        console.error('Client details creation error:', detailsError);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: authData.user.email,
        firstName,
        lastName,
        role: role || 'CLIENT',
      },
    });
  } catch (err: any) {
    console.error('Create user API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
