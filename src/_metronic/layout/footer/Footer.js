/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import { connect } from "react-redux";
import { toAbsoluteUrl } from "../../utils/utils";
import * as builder from "../../ducks/builder";

class Footer extends React.Component {
  render() {
    const today = new Date().getFullYear();
    const {
      footerSelfLayoutIsExtended,
      footerClasses,
      footerContainerClasses
    } = this.props;
    return (
      <div
        className={`kt-footer ${footerClasses} kt-grid__item`}
        id="kt_footer"
        style={{backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-2.jpg")})`}}
      >
        <div className="kt-footer__bottom" style={{backgroundColor: "transparent"}}>
          <div className={`kt-container ${footerContainerClasses}`}>
            <div className="kt-footer__wrapper">
              <div className="kt-footer__logo">
                <Link to={"/"} className="kt-header__brand-logo">
                  <img
                    alt="Logo"
                    className="kt-header__brand-logo-sticky"
                    src={toAbsoluteUrl("/media/logos/logo_euclide_footer.png")}
                  />
                </Link>
                
              </div>
              <div className="kt-footer__menu">
                 {/* <span color="#a9a7bc">{today}&nbsp;&copy;&nbsp;</span> */}
                  <a href="https://www.labvantage.com/" target="_blank">
                    LabVantage
                  </a>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  footerSelfLayoutIsExtended:
    objectPath.get(store.builder.layoutConfig, "footer.self.layout") ===
    "extended",
  footerClasses: builder.selectors.getClasses(store, {
    path: "footer",
    toString: true
  }),
  footerContainerClasses: builder.selectors.getClasses(store, {
    path: "footer_container",
    toString: true
  })
});

export default connect(mapStateToProps)(Footer);
