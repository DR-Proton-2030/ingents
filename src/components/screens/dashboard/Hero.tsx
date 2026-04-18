"use client";

import { useRouter } from "next/navigation";

export const Hero = () => {
	const router = useRouter();

	return (
		<section className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#6366f1] to-[#f0357a] px-5 py-5 text-white shadow-[0_14px_28px_rgba(239,42,111,0.2)] sm:px-6 sm:py-6">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -right-8 -top-16 h-44 w-80 rounded-[48%] bg-white/15" />
				<div className="absolute right-40 top-16 h-64 w-64 rounded-full bg-[#ff7aa8]/55 blur-[0.5px]" />
				<div className="absolute left-1/3 top-20 h-2 w-2 rounded-full bg-yellow-300" />
				<div className="absolute left-2/3 top-10 h-1.5 w-1.5 rounded-full bg-white/80" />
				<div className="absolute left-[58%] top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-200" />
			</div>

			<div className="relative z-10 grid items-center gap-3 lg:grid-cols-[1.2fr_0.8fr]">
				<div>
					<div className="mb-3 inline-flex rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold leading-none tracking-wide">
						PRO PLAN
					</div>

					<div className="max-w-2xl text-[23px] font-bold leading-[1.1] tracking-tight sm:text-[34px]">
						Unlock Premium
						<br />
						Features: Go Pro
					</div>

					<p className="mt-2.5 text-[14px] text-white/90 sm:text-[18px]">
						Let&apos;s be more productive with these powerful features
					</p>

					<div className="mt-5 flex flex-wrap items-center gap-3">
						<button
							onClick={() => router.push("/dashboard/subscription")}
							className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition hover:translate-y-[-1px]"
						>
							Upgrade Now
						</button>
						<button className="text-sm font-semibold underline decoration-2 underline-offset-4 transition hover:text-white/90">
							Learn More
						</button>
					</div>
				</div>

				<div className="relative hidden min-h-[185px] lg:block">

				</div>

				{/* <svg
						viewBox="0 0 380 300"
						className="absolute right-0 top-1/2 h-[190px] w-[245px] -translate-y-1/2"
						aria-hidden="true"
					>
						<ellipse cx="230" cy="115" rx="130" ry="95" fill="#f37ba5" opacity="0.8" />
						<g transform="translate(90,20) rotate(28,120,120)">
							<path d="M160 32c-50 0-90 40-90 90v42h180v-42c0-50-40-90-90-90z" fill="#6f6fe9" />
							<path d="M120 32h80v132h-80z" fill="#7f79ec" />
							<path d="M82 84l-45 45 38 38 45-45z" fill="#5ad7aa" />
							<path d="M238 84l45 45-38 38-45-45z" fill="#52d0a3" />
							<circle cx="160" cy="96" r="34" fill="#f4de63" />
							<circle cx="160" cy="96" r="22" fill="#e6d15d" />
							<rect x="112" y="154" width="96" height="58" rx="20" fill="#4d35d0" />
							<circle cx="160" cy="183" r="18" fill="#ff6d8f" />
							<circle cx="150" cy="178" r="3" fill="#2d2d2d" />
							<circle cx="170" cy="178" r="3" fill="#2d2d2d" />
							<path d="M151 188c2 4 6 6 9 6 4 0 8-2 10-6" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeLinecap="round" />
							<path d="M130 214l-14 40 20-8 7 18 17-44z" fill="#ff3f75" />
							<path d="M190 214l14 40-20-8-7 18-17-44z" fill="#ff3f75" />
							<path d="M154 260l6 34 6-34z" fill="#ffe96f" />
							<path d="M146 258l14 28 14-28z" fill="#fff29b" />
							<circle cx="142" cy="61" r="6" fill="#f5f5f5" />
							<circle cx="183" cy="74" r="4" fill="#f5f5f5" />
							<circle cx="206" cy="125" r="4" fill="#f5f5f5" />
						</g>
					</svg> */}
			</div>
		</section>
	);
};

export default Hero;
