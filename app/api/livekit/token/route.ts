import { AccessToken } from "livekit-server-sdk";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const roomName = Math.random().toString(36).substring(7);
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_SECRET_KEY;
  const at = new AccessToken(apiKey, apiSecret, { identity: "human_user" });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  return Response.json(
    { token: await at.toJwt(), wsUrl: process.env.LIVEKIT_URL },
    {
      status: 200,
    },
  );
}
