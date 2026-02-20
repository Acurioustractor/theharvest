import { Link } from "wouter";
import { colors, fonts, rootStyle } from "@/styles/brand";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import BauhausFooter from "@/components/BauhausFooter";

export default function NotFound() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div style={rootStyle}>
      <section style={{
        backgroundColor: colors.black,
        color: colors.cream,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "80px 28px" : "120px 40px",
        textAlign: "center",
      }}>
        <img src="/images/icon-tractor.png" alt="" style={{
          width: 80,
          height: 54,
          margin: "0 0 24px",
          opacity: 0.6,
        }} />
        <h1 style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: isMobile ? 32 : 48,
          letterSpacing: "0.08em",
          margin: "0 0 16px",
        }}>
          OFF THE PATH
        </h1>
        <p style={{
          fontFamily: fonts.body,
          fontSize: isMobile ? 16 : 18,
          lineHeight: 1.8,
          opacity: 0.7,
          maxWidth: 400,
          margin: "0 0 40px",
        }}>
          You've wandered past the fence line. The gate's back that way.
        </p>
        <Link href="/" style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.1em",
          color: colors.black,
          backgroundColor: colors.yellow,
          padding: "16px 40px",
          textDecoration: "none",
          display: "inline-block",
        }}>
          BACK TO THE HARVEST
        </Link>
      </section>
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
