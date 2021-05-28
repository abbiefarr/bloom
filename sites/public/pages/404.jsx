import Layout from "../layouts/application"
import Head from "next/head"
import { Hero, LinkButton, MarkdownSection, t } from "@bloom-housing/ui-components"

const Custom404 = () => {
  const pageTitle = t("404 - Page Not Found")

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("404 - Page Not Found")}
      </Hero>
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <>
            <p>{t("welcome.seeMoreOpportunities")}</p>
            <LinkButton href="/additional-resources">
              {t("welcome.viewAdditionalHousing")}
            </LinkButton>
          </>
        </MarkdownSection>
      </div>
    </Layout>
  )
}

export { Custom404 as default, Custom404 }
