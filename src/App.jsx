import React from 'react';

const isOperator = /[x/+-]/;
const endsWithOperator = /[x+-/]$/;
const endsWithNegativeSign = /\d[x/+-]{1}-$/;
const clearStyle = {
    background: "#ac3939"
};
const operatorStyle = {
    background: "#666666"
};
const equalsStyle = {
    background: "#004466",
    position: "absolute",
    height: 120
};

class Calculator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentVal: "0",
            prevVal: "0",
            formula: "",
            currentSign: "pos",
            lastClicked: "",
            evaluated: false
        };
        this.maxDigitWarning = this.maxDigitWarning.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleEvaluate = this.handleEvaluate.bind(this);
        this.initialize = this.initialize.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
    }

    maxDigitWarning() {
        this.setState({
            currentVal: "Digit Limit Met",
            prevVal: this.state.currentVal
        });
        setTimeout(() =>
            this.setState({
                currentVal: this.state.prevVal
            }), 1000);
    }

    handleEvaluate() {
        if (!this.state.currentVal.includes("Limit")) {
            let expression = this.state.formula;
            while (endsWithOperator.test(expression)) {
                expression = expression.slice(0, -1);
            }
            expression = expression.replace(/x/g, "*").replace(/--/g, "+");

            let answer;
            try {
                answer = eval(expression);
                if (isNaN(answer) || !isFinite(answer)) {
                    answer = ""; // Show nothing for invalid results
                } else {
                    answer = Math.round(1e12 * answer) / 1e12; // Round result
                }
            } catch (error) {
                answer = ""; // Return empty string instead of NaN
            }

            this.setState({
                currentVal: answer.toString(),
                formula: expression + answer === "" ? "":"= " + answer,
                prevVal: answer,
                evaluated: true
            });
        }
    }

    handleOperators(e) {
        if (!this.state.currentVal.includes("Limit")) {
            const value = e.target.value;
            const { formula, prevVal, evaluated } = this.state;
            this.setState({
                currentVal: value,
                evaluated: false
            });

            if (evaluated) {
                this.setState({
                    formula: prevVal + value
                });
            } else if (endsWithOperator.test(formula)) {
                if (endsWithNegativeSign.test(formula)) {
                    if (value !== "-") {
                        this.setState({
                            formula: prevVal + value
                        });
                    }
                } else {
                    this.setState({
                        formula: (endsWithNegativeSign.test(formula + value) ? formula : prevVal) + value
                    });
                }
            } else {
                this.setState({
                    prevVal: formula,
                    formula: formula + value
                });
            }
        }
    }

    handleNumbers(e) {
        if (!this.state.currentVal.includes("Limit")) {
            const { currentVal, formula, evaluated } = this.state;
            const value = e.target.value;

            if (evaluated) {
                this.setState({
                    currentVal: value,
                    formula: value === "0" ? "" : value,
                    evaluated: false
                });
            } else {
                this.setState({
                    currentVal: currentVal === "0" || isOperator.test(currentVal) ? value : currentVal + value,
                    formula: currentVal === "0" && value === "0" ?
                        (formula === "" ? value : formula) :
                        /([^.0-9]0|^0)$/.test(formula) ? formula.slice(0, -1) + value : formula + value
                });
            }
        }
    }

    handleDecimal() {
        if (this.state.evaluated) {
            this.setState({
                currentVal: "0.",
                formula: "0.",
                evaluated: false
            });
        } else if (!this.state.currentVal.includes(".") && !this.state.currentVal.includes("Limit")) {
            this.setState({
                evaluated: false
            });

            if (this.state.currentVal.length > 21) {
                this.maxDigitWarning();
            } else if (endsWithOperator.test(this.state.formula) ||
                (this.state.currentVal === "0" && this.state.formula === "")) {
                this.setState({
                    currentVal: "0.",
                    formula: this.state.formula + "0."
                });
            } else {
                this.setState({
                    currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
                    formula: this.state.formula + "."
                });
            }
        }
    }

    initialize() {
        this.setState({
            currentVal: "0",
            prevVal: "0",
            formula: "",
            currentSign: "pos",
            lastClicked: "",
            evaluated: false
        });
    }

    render() {
        return (
            <div>
                <div className="calculator">
                    <Formula formula={this.state.formula.replace(/x/g, "*")} />
                    <Output currentValue={this.state.currentVal} />
                    <Buttons
                        decimal={this.handleDecimal}
                        evaluate={this.handleEvaluate}
                        initialize={this.initialize}
                        numbers={this.handleNumbers}
                        operators={this.handleOperators}
                    />
                </div>
            </div>
        );
    }
}

class Buttons extends React.Component {
    render() {
        return (
            <div>
                <button
                    className="jumbo"
                    id="clear"
                    onClick={this.props.initialize}
                    style={clearStyle}
                    value="AC"
                >
                    AC
                </button>
                <button
                    id="divide"
                    onClick={this.props.operators}
                    style={operatorStyle}
                    value="/"
                >
                    /
                </button>
                <button
                    id="multiply"
                    onClick={this.props.operators}
                    style={operatorStyle}
                    value="x"
                >
                    x
                </button>
                <button id="seven" onClick={this.props.numbers} value="7">
                    7
                </button>
                <button id="eight" onClick={this.props.numbers} value="8">
                    8
                </button>
                <button id="nine" onClick={this.props.numbers} value="9">
                    9
                </button>
                <button
                    id="subtract"
                    onClick={this.props.operators}
                    style={operatorStyle}
                    value="-"
                >
                    -
                </button>
                <button id="four" onClick={this.props.numbers} value="4">
                    4
                </button>
                <button id="five" onClick={this.props.numbers} value="5">
                    5
                </button>
                <button id="six" onClick={this.props.numbers} value="6">
                    6
                </button>
                <button id="add" onClick={this.props.operators} style={operatorStyle} value="+">
                    +
                </button>
                <button id="one" onClick={this.props.numbers} value="1">
                    1
                </button>
                <button id="two" onClick={this.props.numbers} value="2">
                    2
                </button>
                <button id="three" onClick={this.props.numbers} value="3">
                    3
                </button>
                <button className="jumbo" id="zero" onClick={this.props.numbers} value="0">
                    0
                </button>
                <button id="decimal" onClick={this.props.decimal} value=".">
                    .
                </button>
                <button id="equals" onClick={this.props.evaluate} style={equalsStyle} value="=">
                    =
                </button>
            </div>
        );
    }
}

class Output extends React.Component {
    render() {
        return (
            <div className="outputScreen" id="display">
                {this.props.currentValue}
            </div>
        );
    }
}

class Formula extends React.Component {
    render() {
        return (
            <div className="formulaScreen">
                {this.props.formula}
            </div>
        );
    }
}

const App = () => {
    return (<div id="app">
        <Calculator />
    </div>);
};

export default App;
