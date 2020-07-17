import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Colors, Fonts } from '../theme'

const noop = () => { }

interface TabProps {
  name: string,
  selected: boolean,
  disabled: boolean,
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void,
  deselect: () => void,
}

const Tab = ({ name, onClick, selected, disabled = false, deselect }: TabProps) => {

  useEffect(() => {
    if (disabled && selected) deselect()
  }, [disabled, selected])

  return (
    <Li
      selected={selected}
      disabled={disabled}
      onClick={(e) => disabled ? noop : onClick(e)}
    >{name}</Li>
  )
}

interface TabContentProps {
  tab: string
  disabled?: boolean
}

interface TabPanelProps {
  children?: React.ReactElement<TabContentProps> | React.ReactElement<TabContentProps>[]
}

export class TabPanel extends React.Component<TabPanelProps, any> {

  constructor(props: any) {
    super(props)
    this.state = {
      selected: 0
    }

    this.selectTab = this.selectTab.bind(this)
  }

  selectTab = (index: number) => {
    this.setState({
      selected: index
    })
  }

  deselect = (index: number) => {
    this.setState({
      selected: 0
    })
  }

  render() {
    const children = (React.Children.toArray(this.props.children) as React.ReactElement<TabContentProps>[])

    return (
      <StyledTabPanel>
        <Nav>
          <ul>
            {
              this.props.children && children.map((child, index) => (
                <Tab
                  key={index}
                  name={child.props?.disabled ? '' : child.props.tab}
                  selected={index === this.state.selected}
                  onClick={() => this.selectTab(index)}
                  disabled={child.props?.disabled}
                  deselect={() => this.deselect(index)}
                />
              ))
            }
          </ul>
        </Nav>
        <TabContent>
          {this.props.children && children[this.state.selected]}
        </TabContent>
      </StyledTabPanel>
    )
  }

}

const liHoverBackground = (selected: boolean, disabled: boolean): string => {
  if (disabled) return Colors.unselected
  return selected ? Colors.highlight : Colors.lighter
}

const liHoverTextColor = (selected: boolean, disabled: boolean): string => {
  if (disabled) return Colors.unselected
  return selected ? Colors.bg : Colors.text
}

const Li = styled.li<{ selected: boolean, disabled: boolean }>`
  padding: 20px;
  font-size: 24px;
  background-color: ${({ selected }) => selected ? Colors.highlight : Colors.unselected};
  color: ${({ disabled }) => disabled ? Colors.unselected : Colors.bg};
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  font-size: 22px;
  font-family: ${Fonts.sans};
  font-size: 30px;
  padding-top: 20px;

  &:hover {
    background-color: ${({ selected, disabled }) => liHoverBackground(selected, disabled)};
    color: ${({ selected, disabled }) => liHoverTextColor(selected, disabled)}
  }

  &:first-child {
    border-top-left-radius: 3px;
  }

  &:last-child {
    border-top-right-radius: 3px;
  }

  @media screen and (max-width: 600px) {
    font-size: 22px;
  }
`

const StyledTabPanel = styled.div`
  margin-top: 80px;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
`

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 100%;

  ul {
    width: 70vw;
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    list-style-type: none;
    padding: 0;
    margin: 0;
    grid-row: 1;

    @media screen and (max-width: 1200px) {
      width: 80vw;
    }

    @media screen and (max-width: 900px) {
      width: 100vw;
    }
  }
`

const TabContent = styled.section`
  font-size: 40px;
  background: ${Colors.bg};
  grid-row: 2;
  width: 70vw;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;

  @media screen and (max-width: 1200px) {
    width: 80vw;

    #recent {
      width: 80vw;
    }
  }

  @media screen and (max-width: 900px) {
    width: 100vw;

    #recent {
      width: calc(100vw - 60px);
      padding-left: 12px;
      padding-right: 24px;
    }
  }

  @media screen and (max-width: 400px) {
    width: 100vw;

    #recent {
      width: calc(100vw - 20px);
      padding-left: 12px;
      padding-right: 24px;
    }
  }
`