import React from 'react'

/**
 * Nav — logo mark left, four links right.
 *
 * Text sits in a `mix-blend-mode: difference` layer so it stays legible over
 * both the paper background and the full-bleed photographs. The colour logo
 * lives in its own fixed layer so the blend never inverts it.
 */
const focusPanel = (side) => {
  window.dispatchEvent(new CustomEvent('arcawave:focus', { detail: side }))
}

const LOGO_W = 44 // 22px tall mark at the SVG's 366:187 ratio

const Nav = () => (
  <>
    <a
      href="#top"
      aria-label="Arcawave"
      className="fixed z-50 left-6 md:left-8 top-[19px]"
    >
      <img
        src="/assets/logos/Arcawave_Logo_Color.svg"
        alt=""
        width={LOGO_W}
        height={22}
        className="h-[22px] w-auto"
      />
    </a>

    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-white">
      <div className="flex items-center justify-between px-6 md:px-8 py-6">
        <span aria-hidden style={{ width: LOGO_W }} />
        <nav className="flex items-center gap-6 md:gap-9 text-[13px] font-medium">
          <a
            href="#build"
            onClick={() => focusPanel('experience')}
            className="hidden sm:inline opacity-80 hover:opacity-100 transition-opacity"
          >
            Experience
          </a>
          <a
            href="#build"
            onClick={() => focusPanel('intelligence')}
            className="hidden sm:inline opacity-80 hover:opacity-100 transition-opacity"
          >
            Intelligence
          </a>
          <a href="#vision" className="opacity-80 hover:opacity-100 transition-opacity">
            About
          </a>
          <a
            href="mailto:help@arcawave.xyz"
            className="opacity-100 hover:opacity-70 transition-opacity"
          >
            Contact ↗
          </a>
        </nav>
      </div>
    </header>
  </>
)

export default Nav
