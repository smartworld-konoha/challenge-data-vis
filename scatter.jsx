var React = require('React')
var linmap = require('linmap')
var jsonist = require('jsonist')
var createReactClass = require('create-react-class')

module.exports = createReactClass({
  getInitialState: function () {
    return {
      data: [],
      selected: null
    }
  },
  componentWillMount: function () {
    var _this = this

    jsonist.get(this.props.dataset, function (err, data) {
      if (err) return console.error(err)

      var lenMin, lenMax, widthMin, widthMax

      data.forEach( function (eachData, index) {
        eachData.id = index

        lenMin || (lenMin = eachData.petalLength)
        lenMax || (lenMax = eachData.petalLength)
        widthMin || (widthMin = eachData.petalWidth)
        widthMax || (widthMax = eachData.petalWidth)
        eachData.petalLength < lenMin && (lenMin = eachData.petalLength)
        eachData.petalLength > lenMax && (lenMax = eachData.petalLength)
        eachData.petalWidth < widthMin && (widthMin = eachData.petalWidth)
        eachData.petalWidth > widthMax && (widthMax = eachData.petalWidth)
      })

      _this.setState({
        data: data,
        lengthMin: lenMin,
        lengthMax: lenMax,
        widthMin: widthMin,
        widthMax: widthMax
      })
    })
  },
  selectItem: function (element) {this.setState({selected: element})},
  render () {
    var selected = this.state.selected
    var divStyle = {
      background: '#222',
      position: 'relative',
      width: this.props.width,
      height: this.props.height,
      border: '1px solid black',
      color: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)',
    }
    return (
      <div style={divStyle}>
        <div>
        {
          this.state.data.map( function (eachData) {
            var withMin = this.state.widthMin
            var	widthMax = this.state.widthMax
            var lengthMin = this.state.lengthMin
            var lengthMax = this.state.lengthMax
            var xPos = linmap(withMin, widthMax, 0, 1, eachData.petalWidth)
            var yPos = linmap(lengthMin, lengthMax, 0, 1, eachData.petalLength)

            var elementStyle = {
              width: 10,
              height: 10,
              borderRadius: 5,
              cursor: 'pointer',
              position: 'absolute',
              left: xPos * this.props.width - 5,
              bottom: yPos * this.props.height - 5,
              background: {
              setosa: '#ff7f0e',
              virginica: '#1f77b4',
              versicolor: '#2ca02c'
              }[eachData.species]
            };

            if ((this.state.selected || {}).id === eachData.id) {
              elementStyle.border = '1px solid white'
            }
            var key = Math.random()

            return (
              <div
               key = {key }
               style = {elementStyle}
               onMouseEnter = {this.selectItem.bind(this, eachData)}
               onMouseLeave = {this.selectItem.bind(this, null)}
              >
             </div>
            )
          }.bind(this))
        }
        </div>
        <div>
          <table>
            <tbody>
            {
              (selected) && Object.keys(selected).reverse().map( function (eachAttr) {
                return (
                  <tr key = {eachAttr}>
                    <td>{eachAttr}</td>
                    <td>{this.state.selected[eachAttr]}</td>
                  </tr>
                )
              }.bind(this))
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
})
