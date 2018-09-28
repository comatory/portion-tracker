import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
} from 'react-toolbox/lib/table'
import { FontIcon } from 'react-toolbox/lib'
import ReactPaginate from 'react-paginate'
import classNames from 'classnames'

import TableUtils from '../utils/table-utils'

import tableStyles from '../styles/table.css'
import styles from '../styles/portion-list.css'

const TABLE_HEADERS = [
  {
    name: 'createdAt',
    label: 'Created at',
  },
  {
    name: 'healthiness',
    label: 'Healthiness',
  },
  {
    name: 'size',
    label: 'Size',
  },
  {
    name: 'calories',
    label: 'Calories',
  },
  {
    name: 'note',
    label: 'Note',
  },
]

export default class PortionList extends React.PureComponent {
  static contextTypes = {
    enumerationStore: PropTypes.object.isRequired,
  }

  static defaultProps = {
    showPagination: true,
  }

  state = this._getState()

  componentWillMount() {
    this.context.enumerationStore.listen(this._handleEnumerationStoreChange)
  }

  componentWillUnmount() {
    this.context.enumerationStore.unlisten(this._handleEnumerationStoreChange)
  }

  _handleEnumerationStoreChange = () => {
    this.setState(this._getState())
  }

  _getState() {
    const portionHealthinesses = this.context.enumerationStore.getEnumeration('portion-healthinesses')
    const portionSizes = this.context.enumerationStore.getEnumeration('portion-sizes')

    return {
      portionHealthinesses,
      portionSizes,
    }
  }

  _renderTableHeader(name, label) {
    const sortColumn = this.props.filter.get('sortColumn')
    const sortDirection = this.props.filter.get('sortDirection')

    const isActive = Boolean(sortColumn === name)
    const isAsc = Boolean(isActive && sortDirection === 'ASC')
    const isDesc = Boolean(isActive && sortDirection === 'DESC')

    return (
      <TableCell
        className={classNames({
          [styles.portion_list_active_header]: isActive,
          [styles.portion_list_asc_header]: isAsc,
          [styles.portion_list_desc_header]: isDesc,
        })}
        key={`portion-list-table-head-cell-${name}`}
      >
        { label }
        {isActive &&
          <div className={styles.portion_list_arrow_header}>
            <FontIcon
              value={isDesc ? 'arrow_drop_down' : 'arrow_drop_up'}
              className={styles.portion_list_arrow}
            />
          </div>
        }
      </TableCell>
    )
  }

  render() {
    return (
      <div className={styles.portion_list}>
        <Table
          selectable={this.props.selectable}
          multiSelectable={this.props.selectable}
          onRowSelect={this.props.onRowSelect}
        >
          <TableHead>
            { TABLE_HEADERS.map((header) => {
              return this._renderTableHeader(header.name, header.label)
            })}
          </TableHead>
          {this.props.portions.map((portion, index) => {
            return (
              <TableRow
                key={`portion-list-row-${portion.get('id')}`}
                selected={this.props.filter.get('selectedRows').includes(portion.get('id'))}
              >
                <TableCell>
                  {String(portion.get('createdAt').format('DD.MM.YYYY HH:mm'))}
                </TableCell>
                <TableCell>
                  {TableUtils.mapIdToName(
                    this.state.portionHealthinesses,
                    portion.get('portionHealthinessId')
                  )}
                </TableCell>
                <TableCell>
                  {TableUtils.mapIdToName(
                    this.state.portionSizes,
                    portion.get('portionSizeId')
                  )}
                </TableCell>
                <TableCell numeric>
                  {portion.get('calories')}
                </TableCell>
                <TableCell>
                  {portion.get('note')}
                </TableCell>
              </TableRow>
            )
          })}
        </Table>
        {this.props.showPagination &&
          <div className={tableStyles.pagination_container}>
            <ReactPaginate
              pageCount={this.props.filter.get('pages')}
              selected={this.props.filter.get('page')}
              onPageChange={this.props.onPageChange}
              containerClassName={tableStyles.pagination}
              pageClassName={tableStyles.pagination_page}
              pageLinkClassName={tableStyles.pagination_link}
              activeClassName={tableStyles.pagination_active_page}
            />
          </div>
        }
      </div>
    )
  }
}
