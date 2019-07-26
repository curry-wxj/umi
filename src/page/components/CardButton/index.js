import React from "react";
import PropTypes from "prop-types";
import styles from "./index.less";

class CardButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastValue: props.names[0].value
    };
  }

  handleClick = value => {
    const { onChange } = this.props;
    onChange(value);
    this.setState({
      lastValue: value
    });
  };

  render() {
    const { names } = this.props;
    const { lastValue } = this.state;
    return (
      <div className={styles["card-button-wrap"]}>
        {names.map((name, index) => {
          const currentStyle =
            names.length > 1 && lastValue === name.value
              ? styles["card-button-active"]
              : styles["card-button"];
          return (
            <React.Fragment>
              <div
                key={name.value}
                className={currentStyle}
                onClick={() => this.handleClick(name.value)}
              >
                {name.title}
              </div>
              {names.length - 1 !== index && (
                <span className={styles["card-span"]}>|</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

CardButton.propTypes = {
  names: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  onChange: PropTypes.func.isRequired
};

CardButton.defaultProps = {
  names: [{ title: "月", value: "month" }, { title: "年", value: "year" }]
};

export default CardButton;
