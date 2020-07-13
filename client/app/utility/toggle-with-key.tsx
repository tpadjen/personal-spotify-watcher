import React from 'react'


interface ToggleWithKeyProps {
  keyName: string,
  showOnStart?: boolean
}

interface ToggleWithKeyState {
  hidden: boolean
}

export class ToggleWithKey extends React.Component<ToggleWithKeyProps, ToggleWithKeyState> {

  constructor(props: any) {
    super(props)

    this.state = {
      hidden: !props.showOnStart
    }

    this.handleKeydown = this.handleKeydown.bind(this)
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key === this.props.keyName) {
      this.setState(() => {
        return {
          hidden: !this.state.hidden
        }
      })
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  render() {
    return (
      <div className={this.state.hidden ? 'hidden' : ''}>
        {this.props.children}
      </div>
    )
  }

}
