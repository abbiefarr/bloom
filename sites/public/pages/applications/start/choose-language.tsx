/*
0.1 - Choose Language
Applicants are given the option to start the Application in one of a number of languages via button group. Once inside the application the applicant can use the language selection at the top of the page.
https://github.com/bloom-housing/bloom/issues/277
*/
import axios from "axios"
import { useRouter } from "next/router"
import {
  Button,
  ImageCard,
  imageUrlFromListing,
  LinkButton,
  FormCard,
  ProgressNav,
  UserContext,
  t,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext, retrieveApplicationConfig } from "../../../lib/AppSubmissionContext"
import React, { useContext, useEffect, useState } from "react"

const loadListing = async (listingId, stateFunction, conductor, context) => {
  const response = await axios.get(process.env.listingServiceUrl)
  conductor.listing = response.data.find((listing) => listing.id == listingId) || response.data[0] // FIXME: temporary fallback
  const applicationConfig = retrieveApplicationConfig() // TODO: load from backend
  conductor.config = applicationConfig
  stateFunction(conductor.listing)
  context.syncListing(conductor.listing)
}

export default () => {
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [newLocale, setNewLocale] = useState("")
  const context = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(UserContext)
  const { conductor, application } = context

  const listingId = router.query.listingId

  useEffect(() => {
    if (!context.listing || context.listing.id != listingId) {
      void loadListing(listingId, setListing, conductor, context)
    } else {
      setListing(context.listing)
    }
  }, [conductor, context, listingId])

  const currentPageSection = 1

  const imageUrl = listing?.assets ? imageUrlFromListing(listing) : ""

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.sync()
    void router.push(`${newLocale}${conductor.determineNextUrl()}`)
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={
            listing?.applicationConfig.sections || [
              "You",
              "Household",
              "Income",
              "Preferences",
              "Review",
            ]
          }
        />
      </FormCard>

      <FormCard className="overflow-hidden">
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.chooseLanguage.letsGetStarted")}
          </h2>
        </div>

        {listing && (
          <div className="form-card__group p-0 m-0">
            <ImageCard title={listing.name} imageUrl={imageUrl} listing={listing} />
          </div>
        )}

        <div className="form-card__pager">
          <Form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-card__pager-row primary px-4">
              {listing?.applicationConfig.languages.length > 1 && (
                <>
                  <h3 className="mb-4 font-alt-sans field-label--caps block text-base text-black">
                    {t("application.chooseLanguage.chooseYourLanguage")}
                  </h3>

                  {listing.applicationConfig.languages.map((lang) => (
                    <Button
                      className="language-select mx-1"
                      onClick={() => {
                        setNewLocale(lang == "en" ? "" : `/${lang}`)
                      }}
                    >
                      {t(`applications.begin.${lang}`)}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </Form>

          {initialStateLoaded && !profile && (
            <div className="form-card__pager-row primary px-4 border-t border-gray-450">
              <h2 className="form-card__title w-full border-none pt-0 mt-0">
                {t("account.haveAnAccount")}
              </h2>

              <p className="my-6">{t("application.chooseLanguage.signInSaveTime")}</p>

              <div>
                <LinkButton
                  href={`/sign-in?redirectUrl=/applications/start/choose-language&listingId=${listingId?.toString()}`}
                >
                  {t("nav.signIn")}
                </LinkButton>
              </div>
            </div>
          )}
        </div>
      </FormCard>
    </FormsLayout>
  )
}
