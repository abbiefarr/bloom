import * as React from "react"
import { LinkButton } from "../actions/LinkButton"
import { Listing } from "@bloom-housing/backend-core/types"
import moment from "moment"
import { t } from "../helpers/translator"
import { openDateState } from "../helpers/state"
import "./Hero.scss"

export interface HeroProps {
  title: React.ReactNode
  backgroundImage?: string
  buttonTitle: string
  buttonLink: string
  secondaryButtonTitle?: string
  secondaryButtonLink?: string
  listings?: Listing[]
  children?: React.ReactNode
  centered?: boolean
}

const listingOpen = (listing: Listing) => {
  return moment() < moment(listing.applicationDueDate)
}

const HeroButton = (props: { title: string; href: string }) => (
  <span className="hero__button">
    <LinkButton href={props.href}>{props.title}</LinkButton>
  </span>
)

const Hero = (props: HeroProps) => {
  let subHeader, styles
  let classNames = ""
  if (props.listings) {
    if (!props.listings.some(listingOpen) && !props.listings.some(openDateState)) {
      subHeader = <h2 className="hero__subtitle">{t("welcome.allApplicationClosed")}</h2>
    }
  } else if (props.children) {
    subHeader = <h2 className="hero__subtitle">{props.children}</h2>
  }
  if (props.backgroundImage) {
    styles = { backgroundImage: `url(${props.backgroundImage})` }
  }
  if (props.centered) {
    classNames = "centered"
  }
  return (
    <div className={`hero ${classNames}`} style={styles}>
      <h1 className="hero__title">{props.title}</h1>
      {subHeader}
      <HeroButton href={props.buttonLink} title={props.buttonTitle} />
      {props.secondaryButtonTitle && props.secondaryButtonLink && (
        <HeroButton href={props.secondaryButtonLink} title={props.secondaryButtonTitle} />
      )}
    </div>
  )
}

export { Hero as default, Hero }
