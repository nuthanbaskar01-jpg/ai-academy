import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_email, event_name, metadata } = body;

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          user_email,
          event_name,
          metadata,
        },
      ]);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}