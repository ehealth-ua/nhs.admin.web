import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import { translate } from "react-i18next";
import Helmet from "react-helmet";

import { H1 } from "components/Title";
import { ListPagination } from "components/List";
import Pagination from "components/CursorPagination";
import Icon from "components/Icon";

import BackLink from "containers/blocks/BackLink";
import ClinicsList from "containers/blocks/ClinicsList";
import ShowBy from "containers/blocks/ShowBy";

import { getClinics } from "reducers";

import { fetchClinics } from "./redux";

const ClinicsVerificationListPage = ({ clinics = [], paging, location, t }) => (
  <div id="clinics-verification-list-page">
    <Helmet
      title={t("Verification clinics")}
      meta={[{ property: "og:title", content: t("Verification clinics") }]}
    />

    <BackLink to="/clinics-verification" detached>
      {t("Back to search page")}
    </BackLink>

    <H1>{t("Verification clinics")}</H1>

    <ShowBy location={location} />

    <ClinicsList clinics={clinics} />

    {paging.cursors && (
      <ListPagination>
        <Pagination
          location={location}
          after={paging.cursors.starting_after}
          before={paging.cursors.ending_before}
        />
      </ListPagination>
    )}
  </div>
);

export default compose(
  translate(),
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(fetchClinics({ ...query, nhs_verified: false }))
  }),
  connect(
    state => ({
      ...state.pages.ClinicsListPage,
      clinics: getClinics(state, state.pages.ClinicsListPage.clinics)
    }),
    { fetchClinics }
  )
)(ClinicsVerificationListPage);
