var PatientTab = React.createClass({
  handleClick: function(e){
    e.preventDefault();
    this.props.handleClick();
  },

  render: function(){
    return (
      <li className={this.props.isCurrent ? 'active' : null}>
        <a onClick={this.handleClick} href={this.props.url}>
          {this.props.name}
        </a>
      </li>
    );
  }
});
