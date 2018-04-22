import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
} from 'react-toolbox/lib/table'
import { List } from 'immutable'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

import TableUtils from '../utils/table-utils'

import tableStyles from '../styles/table.css'
import styles from '../styles/portion-list.css'

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

  render() {
    return (
      <div className={styles.portion_list}>
        <Table>
        <TableHead>
          <TableCell>Created at</TableCell>
          <TableCell>Healthiness</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Calories</TableCell>
          <TableCell>Note</TableCell>
        </TableHead>
        {this.props.portions.map((portion, index) => {
          return (
            <TableRow
              key={`portion-list-row-${portion.get('id')}`}
            >
              <TableCell>
                {String(moment(portion.get('createdAt')).format('DD.MM.YYYY HH:mm'))}
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