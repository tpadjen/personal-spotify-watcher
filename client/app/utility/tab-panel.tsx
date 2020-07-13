import React from 'react'
import styled from 'styled-components'
import { Colors, Fonts } from '../theme'


const Li = styled.li<{ selected: boolean }>`
  padding: 20px;
  font-size: 24px;
  background-color: ${({selected}) => selected ? Colors.highlight : Colors.unselected};
  color: ${Colors.bg};
  cursor: pointer;
  font-size: 22px;
  font-family: ${Fonts.sans};
  font-size: 30px;
  padding-top: 20px;

  &:hover {
    background-color: ${({selected}) => selected ? Colors.highlight : Colors.lighter};
    color: ${({selected}) => selected ? Colors.bg : Colors.text}
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

interface TabProps {
  name: string,
  selected: boolean,
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

const Tab = ({name, onClick, selected}: TabProps) => {
  return (
    <Li
      selected={selected}
      onClick={onClick}
    >{name}</Li>
  )
}

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

interface TabContentProps {
  tab: string
}

interface TabPanelProps {
  children?: React.ReactElement<TabContentProps> | React.ReactElement<TabContentProps>[];
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
                  name={child.props.tab}
                  selected={index === this.state.selected}
                  onClick={() => this.selectTab(index)}
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
