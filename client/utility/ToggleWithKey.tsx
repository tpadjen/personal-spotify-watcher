import React, { ReactElement } from 'react'


interface ToggleWithKeyProps {
  keyName: string,
  showOnStart?: boolean
}

interface ToggleWithKeyState {
  hidden: boolean
}

export class ToggleWithKey extends React.Component<ToggleWithKeyProps, ToggleWithKeyState> {

  constructor(props: ToggleWithKeyProps) {
    super(props)

    this.state = {
      hidden: !props.showOnStart
    }

    this.handleKeydown = this.handleKeydown.bind(this)
  }

  handleKeydown(e: KeyboardEvent): void {
    if (e.key === this.props.keyName) {
      this.setState(() => {
        return {
          hidden: !this.state.hidden
        }
      })
    }
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  render(): ReactElement {
    return (
      <div className={this.state.hidden ? 'hidden' : ''}>
        {this.props.children}
      </div>
    )
  }

}
