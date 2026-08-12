import { PageFrame, PageFrameProps } from "./types"
import HeaderConstructor from "../Header"

const Header = HeaderConstructor()

/**
 * Top-level navigation links shown in the top bar.
 * Edit this list to change the menu (add "About" here once /about exists).
 * hrefs are absolute site paths; Korean folder slugs are kept raw (the browser
 * URL-encodes them, and Quartz's SPA router resolves same-origin anchors).
 */
const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "AI PM 과정", href: "/ai-pm-과정/" },
  { label: "프로덕트 회고", href: "/프로덕트-회고/" },
  { label: "Case Study", href: "/case-study/" },
  // { label: "About", href: "/about/" },
]

// section key for active-state matching (strip leading/trailing slashes)
const sectionKey = (href: string) => href.replace(/^\/|\/$/g, "")

/**
 * Top-nav page frame — a single centered content column with a sticky top
 * navigation bar (brand + menu links + darkmode toggle), no sidebars.
 *
 * Relies on the `left` layout slot resolving to `[page-title, toolbar-group]`
 * (see quartz.config.yaml): left[0] is rendered as the brand, the rest as the
 * top-bar actions (the darkmode toggle). Layout/width CSS for this frame lives
 * in quartz/styles/custom.scss under `.page[data-frame="top-nav"]`.
 */
export const TopNavFrame: PageFrame = {
  name: "top-nav",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    footer: Footer,
  }: PageFrameProps) {
    const currentSlug = String(componentData.fileData?.slug ?? "")
    const isHome = currentSlug === "index" || currentSlug === ""
    const Brand = left[0]
    const Actions = left.slice(1)

    return (
      <>
        <div class="topnav">
          <div class="topnav-inner">
            <div class="topnav-brand">{Brand ? <Brand {...componentData} /> : null}</div>
            <nav class="topnav-links">
              {NAV_ITEMS.map((item) => {
                const key = sectionKey(item.href)
                const active = item.href === "/" ? isHome : !isHome && currentSlug.startsWith(key)
                return (
                  <a href={item.href} class={active ? "active" : ""}>
                    {item.label}
                  </a>
                )
              })}
            </nav>
            <div class="topnav-actions">
              {Actions.map((ActionComponent) => (
                <ActionComponent {...componentData} />
              ))}
            </div>
          </div>
        </div>
        <div class="center full-width topnav-body">
          <div class="page-header">
            <Header {...componentData}>
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </Header>
            <div class="popover-hint">
              {beforeBody.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </div>
          <Content {...componentData} />
          <hr />
          <div class="page-footer">
            {afterBody.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
          </div>
        </div>
        <Footer {...componentData} />
      </>
    )
  },
}
