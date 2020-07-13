import React from "react"
const renderjson: any = require('renderjson')


renderjson.set_show_to_level(1)
renderjson.set_sort_objects(true)
renderjson.set_icons('►', '▼')
renderjson.set_collapse_msg(() => '')


export class JSONPanel extends React.Component<any, any> {

  jsonRef: React.RefObject<HTMLDivElement>

  constructor(props: any) {
    super(props)
    this.jsonRef = React.createRef()
  }

  shouldComponentUpdate(nextProps: any) {
    return JSON.stringify(this.props.json) !== JSON.stringify(nextProps.json)
  }

  componentDidUpdate(prevProps: any, prevState: any): any {
    if (this.jsonRef && this.jsonRef.current) {
      this.jsonRef.current.innerHTML = ''
      this.jsonRef.current.appendChild(renderjson(this.props.json))
    }
    return null
  }

  render() {
    return <div className="json-container" ref={this.jsonRef}></div>
  }
}
