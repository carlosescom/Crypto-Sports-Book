import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'

// Components
import { ContractForm } from 'drizzle-react-components'
import Balance from '../components/Balance.js'
import _ from 'lodash'

class BalanceSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentAccount: props.drizzleState.accounts[0],
            index: 0,
        }
        this.changeIndex = this.changeIndex.bind(this)
    }

    changeIndex(event) {
        const { value } = event.target
        if (0 <= value && value < 10) {
            this.setState({
                currentAccount: this.props.drizzleState.accounts[value],
                index: value,
            })
        }
    }

    render() {
        if (_.isEmpty(this.props.drizzleState.accounts)) {
            return (
                <div>
                    503 - Service unavailable - BalanceSelect.js: _.isEmpty(this.props.drizzleState.accounts)
        </div>
            )
        }
        else {
            return (
                <div className="container">
                    <h2>Send tokens</h2>
                    <div>
                        <table className="pure-table">
                            <tbody>
                                <Balance
                                    drizzle={this.props.drizzle}
                                    drizzleState={this.props.drizzleState}
                                    index={this.state.index}
                                    tokenContract={this.props.tokenContract} />
                            </tbody>
                        </table>
                        <form className="pure-form">
                            <fieldset>
                                <label htmlFor="selectedAccount">
                                    <strong>send from: </strong>
                                </label>
                                <input
                                    id="selectedAccount"
                                    type="number"
                                    value={this.state.index}
                                    onChange={this.changeIndex} />
                            </fieldset>
                        </form>
                    </div>
                    <ContractForm
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract={this.props.tokenContract}
                        method="transfer"
                        labels={['To Address', 'Amount to Send']}
                        sendArgs={{ from: this.state.currentAccount }} />
                    <br /><br />
                </div>
            )
        }
    }
}

export default (props) => (
    <DrizzleContext.Consumer>
        {
            drizzleContext => {
                var drizzle = drizzleContext.drizzle
                var drizzleState = drizzle.store.getState()
                return (
                    <BalanceSelect
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                        tokenContract={props.tokenContract} />
                )
            }
        }
    </DrizzleContext.Consumer >
)