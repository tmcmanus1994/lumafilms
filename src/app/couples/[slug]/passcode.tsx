import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getWedding } from "@/lib/content";

export async function verifyPasscode(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const attempt = String(formData.get("passcode") ?? "");
  const w = getWedding(slug);
  if (w?.passcode && attempt.trim() === w.passcode) {
    const jar = await cookies();
    jar.set(`luma_gallery_${slug}`, "ok", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: `/couples/${slug}`,
    });
  }
  redirect(`/couples/${slug}`);
}

export default function PasscodeGate({
  slug,
  couple,
  action,
}: {
  slug: string;
  couple: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow mb-4">Private Gallery</p>
      <h1 className="display mb-6 text-4xl md:text-5xl">{couple}</h1>
      <form action={action} className="flex w-full max-w-[360px] flex-col gap-5">
        <input type="hidden" name="slug" value={slug} />
        <label htmlFor="passcode" className="eyebrow text-xs">
          Enter your gallery passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          required
          className="border-0 border-b border-[#C9BDA8] bg-transparent px-0 py-2.5 text-center font-body text-base text-ink outline-none focus:border-ink"
        />
        <button type="submit" className="btn btn-fill cursor-pointer">
          Open Gallery
        </button>
      </form>
    </section>
  );
}
