import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
const noop = () => { }


interface TabProps {
  name: string,
  selected: boolean,
  disabled: boolean,
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void,
  deselect: () => void,
  TabComponent: React.ComponentType<any> | React.ElementType<any>,
  colors: TabColors,
}

const Tab = ({
  name,
  onClick,
  selected,
  disabled = false,
  deselect,
  TabComponent = StyledTab,
  colors,
}: TabProps) => {

  useEffect(() => {
    if (disabled && selected) deselect()
  }, [disabled, selected])

  return (
    <TabComponent
      selected={selected}
      disabled={disabled}
      onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => disabled ? noop : onClick(e)}
      colors={colors}
    >
      {name}
    </TabComponent>
  )
}

interface TabContentProps {
  tab: string
  disabled?: boolean
}

export interface TabColors {
  highlight: string,
  unselected: string,
  bg: string,
  text: string,
  lighter: string,
}

const DefaultColors: TabColors = {
  highlight: 'red',
  unselected: 'gray',
  bg: 'white',
  text: 'black',
  lighter: 'aaaaaa',
}

interface TabPanelProps {
  children?: React.ReactElement<TabContentProps> | React.ReactElement<TabContentProps>[],
  Nav?: React.ComponentType<any> | React.ElementType<any>,
  NavList?: React.ComponentType<any> | React.ElementType<any>,
  Content?: React.ComponentType<any> | React.ElementType<any>,
  Panel?: React.ComponentType<any> | React.ElementType<any>,
  Tab?: React.ComponentType<any> | React.ElementType<any>,
  colors?: TabColors,
}

export const TabPanel = ({
  children,
  Nav = StyledTabNav,
  NavList = StyledTabNavList,
  Content = StyledTabContent,
  Panel = StyledTabPanel,
  Tab: TabComponent,
  colors = DefaultColors,
}: TabPanelProps) => {

  const [selected, setSelected] = useState(0)

  const deselect = (index: number) => setSelected(0)

  const childrenEls = (React.Children.toArray(children) as React.ReactElement<TabContentProps>[])

  return (
    <Panel>
      <Nav>
        <NavList>
          {
            childrenEls && childrenEls.map((child, index) => (
              <Tab
                key={index}
                name={child.props?.disabled ? '' : child.props.tab}
                selected={index === selected}
                onClick={() => setSelected(index)}
                disabled={child.props?.disabled}
                deselect={() => deselect(index)}
                TabComponent={TabComponent}
                colors={colors}
              />
            ))
          }
        </NavList>
      </Nav>
      <Content colors={colors}>
        {childrenEls && childrenEls[selected]}
      </Content>
    </Panel>
  )
}



export const StyledTab = styled.li<{ selected: boolean, disabled: boolean, colors: TabColors }>`
  padding: 20px;
  font-size: 24px;
  background-color: ${({ selected, colors }) => selected ? colors.highlight : colors.unselected};
  color: ${({ disabled, colors }) => disabled ? colors.unselected : colors.bg};
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  font-size: 22px;
  font-family: 'sans';
  font-size: 30px;
  padding-top: 20px;

  &:hover {
    background-color: ${({ selected, disabled, colors }) => disabled ? colors.unselected : (selected ? colors.highlight : colors.bg)};
    color: ${({ selected, disabled, colors }) => disabled ? colors.unselected : (selected ? colors.bg : colors.text)};
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

export const StyledTabPanel = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
`

export const StyledTabNav = styled.nav`
  display: grid;
  grid-template-columns: 100%;
  width: 500px;
`

export const StyledTabNavList = styled.ul`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  list-style-type: none;
  padding: 0;
  margin: 0;
  grid-row: 1;
`

export const StyledTabContent = styled.section<{ colors: TabColors }>`
  font-size: 40px;
  background: ${({ colors }) => colors.bg};
  grid-row: 2;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  width: 500px;
  overflow: scroll;
`