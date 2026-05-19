import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, signature, pin, type } = body;

    if (!userId || !signature) {
      return NextResponse.json({ error: 'Missing userId or signature data' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Decode base64 data URL
    const base64Data = signature.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${userId}-${type || 'client'}-${Date.now()}.png`;

    // 2. Upload to Supabase Storage signatures bucket using service_role (bypasses RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('signatures')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 3. Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('signatures')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 4. Update the database securely
    if (type === 'staff') {
      const { error: dbError } = await supabaseAdmin
        .from('profiles')
        .update({ signature_url: publicUrl })
        .eq('id', userId);

      if (dbError) throw dbError;
    } else if (type === 'parent') {
      const { error: dbError } = await supabaseAdmin
        .from('client_details')
        .update({ parent_pin: pin })
        .eq('profile_id', userId);

      if (dbError) throw dbError;
    } else {
      // Default: client
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ signature_url: publicUrl })
        .eq('id', userId);

      if (profileError) throw profileError;

      if (pin) {
        const { error: pinError } = await supabaseAdmin
          .from('client_details')
          .update({ client_pin: pin })
          .eq('profile_id', userId);

        if (pinError) throw pinError;
      }
    }

    return NextResponse.json({ success: true, publicUrl });
  } catch (error: unknown) {
    console.error('Signature upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
