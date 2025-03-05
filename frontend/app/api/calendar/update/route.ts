import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

 // @ts-ignore: Module 'googleapis' might need to be installed with its types.
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export async function PUT() {
    
}