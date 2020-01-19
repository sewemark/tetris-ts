import React from "react";
import { connect } from "react-redux";

class GameScore extends React.Component {
  constructor(props: object) {
    super(props);
  }

  render() {
    return (
      <div className="gameContainer__gameScore">
        <h2 className="heading-2">
          Your score {(this.props as any).gameScore}
        </h2>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  gameScore: state.game.gameScore,
});

export default connect(mapStateToProps)(GameScore);
