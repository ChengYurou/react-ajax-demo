var UserGist = React.createClass({
    getInitialState: function() {
        return {
            username: '',
            url: ''
        };
    },

    componentDidMount: function() {
        $.get(this.props.source, function(result) {
            var user = result[0];
            if (this.isMounted()) {
                this.setState({
                    username: user.name,
                    url: user.items.html_url
                });
            }
        }.bind(this));
    },

    render: function() {
        return (
            <div>
            {this.state.username}'s github is
        <a href={this.state.url}>here</a>.
        </div>
        );
    }
});

ReactDOM.render(
<UserGist source="./ajax/react-ajax.json" />,
    document.getElementById('content')
);