import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps"
import {Button} from 'react-bootstrap'
import * as TransactionActions from '../actions/transactions'
import conf from '../../../conf'

class Map extends Component {

  handleMapClick(event) {
    console.log('map click', event);
    const { transaction } = this.props
    if (transaction.clerk_state.state == 'select-source') {
      console.log(event);
      this.props.actions.editTransaction(transaction._id, {
        source: latLngFromEvent(event)
      })
    } else if (transaction.clerk_state.state == 'select-destination') {
      this.props.actions.editTransaction(transaction._id, {
        destination: latLngFromEvent(event)
      })

    }
  }

  handleSourceSelected() {
    this.props.actions.setTransactionState(this.props.transaction._id, 'select-destination')
  }

  handleDestinationSelected() {
    this.props.actions.setTransactionState(this.props.transaction._id, 'searching-driver')
  }

  actionButton() {
    let button = undefined
    const { transaction } = this.props
    switch(transaction.clerk_state.state) {
      case 'select-source':
        button = transaction.source ? (
          <Button onClick={::this.handleSourceSelected}>Pick me up from here</Button>
          ) : undefined
        break;
      case 'select-destination':
        button = transaction.destination ? (
          <Button onClick={::this.handleDestinationSelected}>Drop me there</Button>
          ) : undefined
        break;
    }

    return button
  }

  render() {
    const { transaction } = this.props
    const source = transaction.source ? (
      <Marker
        position={transaction.source}
        icon="http://localhost:8080/images/person.png"
        title="Me"
        label="Me">
       </Marker>) : undefined

    const destination = transaction.destination ? (
      <Marker
        position={transaction.destination}
        title='Destination'
        label='Destination'>
       </Marker>) : undefined

    if (!source) return;
    const { drivers } = transaction
    console.log('drivers:', drivers)
    const driversMarkup = drivers ? drivers.map(driver => {
      return (
        <Marker
          position={driver.position}
          icon="http://localhost:8080/images/dragon.png"
          title={driver.name}
          label={driver.name}
          animation={google.maps.Animation.DROP}>
        </Marker>
        )
    }) : undefined

    const { driver } = transaction
    console.log('driver:', driver)
    const driverMarkup = driver ? (
        <Marker
          position={driver.position}
          icon="http://localhost:8080/images/dragon.png"
          title={driver.name}
          label={driver.name}>
        </Marker>
      ) : undefined

    return (
      <div id='map' style={{height: '300px', width: '100%'}}>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props.containerElementProps}
              style={{
                height: "100%",
              }}></div>
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={12}
              defaultCenter={transaction.source}
              onClick={::this.handleMapClick}>
                {source}
                {destination}
                {driversMarkup}
                {driverMarkup}
            </GoogleMap>
          }
        ></GoogleMapLoader>
        {this.actionButton()}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TransactionActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

function latLngFromEvent(event) {
  return {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };
}