var PatientTabs = React.createClass({
  handleClick: function(tab){
    this.props.changeTab(tab);
  },

  render: function(){
    return (
      <ul className='tabs'>
        {this.props.tabList.map(function(tab) {
          return (
            <PatientTab
              handleClick={this.handleClick.bind(this, tab)}
              key={tab.id}
              url={tab.url}
              name={tab.name}
              isCurrent={(this.props.currentTab === tab.id)}
              />
          );
        }.bind(this))}
      </ul>
    );
  }
});
