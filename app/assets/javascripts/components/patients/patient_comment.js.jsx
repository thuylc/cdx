var PatientComment = React.createClass({
  render: function(){
    return (
      <tr>
        <td>{this.props.comment.comment_date}</td>
        <td>{this.props.comment.commenter}</td>
        <td>{this.props.comment.title}</td>
      </tr>
    );
  }
});
