import React, { ReactElement } from 'react'
import renderjson = require('renderjson')


interface JSONPanelProps {
  json: Record<string, unknown>,
  level?: number,
  sort?: boolean,
  closedIcon?: string,
  openIcon?: string,
  collapseMessage?: string,
  // 'Indexer'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

export class JSONPanel extends React.Component<JSONPanelProps> {
  static defaultProps = {
    level: 1,
    sort: true,
    closedIcon: '►',
    openIcon: '▼',
    collapseMessage: ''
  }

  jsonRef: React.RefObject<HTMLDivElement> = React.createRef()

  // constructor(props: JSONPanelProps) {
  //   super(props)
  //   this.jsonRef = React.createRef()
  // }

  shouldComponentUpdate(nextProps: JSONPanelProps): boolean {
    return JSON.stringify(this.props.json) !== JSON.stringify(nextProps.json)
  }

  componentDidUpdate(): void {
    if (this.jsonRef && this.jsonRef.current) {
      renderjson.set_show_to_level(1)
      renderjson.set_sort_objects(true)
      renderjson.set_icons('►', '▼')
      renderjson.set_collapse_msg(() => '')

      this.jsonRef.current.innerHTML = ''
      this.jsonRef.current.appendChild(renderjson(this.props.json))
    }
    return null
  }

  render(): ReactElement {
    return <div className="json-container" ref={this.jsonRef}></div>
  }
}
