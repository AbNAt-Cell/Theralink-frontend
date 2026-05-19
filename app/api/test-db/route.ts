import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get 1 row from client_details to see its keys
    const { data: detailsData, error: detailsError } = await supabaseAdmin
      .from('client_details')
      .select('*')
      .limit(1);

    if (detailsError) {
      return NextResponse.json({ error: detailsError }, { status: 500 });
    }

    const columns = detailsData && detailsData.length > 0 ? Object.keys(detailsData[0]) : [];

    // Let's also check if we can query information_schema directly
    const { error: schemaError } = await supabaseAdmin
      .from('client_details')
      .select('id')
      .limit(1);

    return NextResponse.json({
      message: 'Database check complete',
      columns,
      detailsData,
      schemaError
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
