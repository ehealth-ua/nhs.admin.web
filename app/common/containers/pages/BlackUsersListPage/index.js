import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { setFilter, getFilter } from 'helpers/filter';

import { ListHeader, ListShowBy, ListTable } from 'components/List';
import { H1, H2 } from 'components/Title';
import Pagination from 'components/Pagination';
import Button from 'components/Button';
import Table from 'components/Table';
import ColoredText from 'components/ColoredText';

import ShowBy from 'containers/blocks/ShowBy';
import SearchForm from 'containers/forms/SearchForm';
import DateFilterForm from 'containers/forms/DateFilterForm';

import { getBlackUsers } from 'reducers';

import { fetchBlackListUsers } from './redux';

const FILTERS = [
  { name: 'id', title: 'За ID' },
  { name: 'tax_id', title: 'За tax_id' }
];

const BlackUsersListPage = ({
  location,
  router,
  black_list_users = [],
  paging,
  activeFilter,
  activeDateFilter = []
}) => (
  <div id="black-list-users-list-page">
    <Helmet
      title="Заблоковані користувачі"
      meta={[{ property: 'og:title', content: 'Заблоковані користувачі' }]}
    />
    <ListHeader
      button={
        <Button
          to="/black-list-users/create"
          theme="border"
          size="small"
          color="orange"
          icon="add"
        >
          Додати користувача
        </Button>
      }
    >
      <H1>Заблоковані користувачі</H1>
    </ListHeader>

    <div>
      <H2>Пошук користувача</H2>

      <SearchForm
        active={activeFilter}
        placeholder="Знайти користувача"
        items={FILTERS}
        initialValues={{ [activeFilter]: location.query[activeFilter] }}
        onSubmit={values => setFilter(values, { location, router })}
      />
    </div>

    <ListShowBy>
      <ShowBy
        active={Number(location.query.page_size) || 5}
        onChange={page_size => setFilter({ page_size }, { location, router })}
      />
    </ListShowBy>

    <ListTable id="medication-dispenses-table">
      <Table
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'tax_id', title: 'ID tax_id' },
          { key: 'name', title: "Ім'я користувача" },
          { key: 'birth', title: 'Дата народження' },
          { key: 'status', title: 'Статус' },
          {
            key: 'action',
            title: 'Детально / Деактивація',
            width: 200
          }
        ]}
        data={black_list_users.map(
          ({
            id,
            tax_id,
            is_active,
            parties: [{ first_name, last_name, second_name, birth_date }]
          }) => ({
            id,
            tax_id,
            birth: birth_date,
            name: <div>{`${last_name} ${first_name} ${second_name}`}</div>,
            status: (
              <div>
                {is_active ? (
                  <ColoredText color="green">активна</ColoredText>
                ) : (
                  <ColoredText color="red">неактивна</ColoredText>
                )}
              </div>
            ),
            action: (
              <Button
                id={`show-black-list-users-detail-button-${id}`}
                theme="link"
                to={`/black-list-users/${id}`}
              >
                Детально
              </Button>
            )
          })
        )}
      />
    </ListTable>

    {paging.total_pages > 1 && (
      <Pagination
        currentPage={paging.page_number}
        totalPage={paging.total_pages}
        location={location}
      />
    )}
  </div>
);

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(fetchBlackListUsers({ page_size: 5, ...query }))
  }),
  connect((state, props) => ({
    ...state.pages.BlackUsersListPage,
    black_list_users: getBlackUsers(
      state,
      state.pages.BlackUsersListPage.blackListUsers
    ),
    activeFilter: getFilter(props, FILTERS)
  }))
)(BlackUsersListPage);