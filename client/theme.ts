import styled from 'styled-components'
import {
  StyledTabContent,
  StyledTab,
  StyledTabNav,
  StyledTabNavList,
  StyledTabPanel,
  TabColors,
} from './utility/TabPanel'


export const Colors = {
  page: '#6a6a6a',
  bg: '#333',
  text: '#cdcdcd',
  highlight: '#189cc4',
  alternate: '#ffbcbc',
  unselected: '#8a8a8a',
  darker: '#111',
  darkerPage: '#282828',
  lighter: '#555',
}

export const Fonts = {
  serif: "'Enriqueta', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  sans: "'Josefin Sans', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
}

interface ThemeColors {
  a: string,
  disclosure: string,
  syntax: string,
  string: string,
  number: string,
  boolean: string,
  key: string,
  keyword: string,
  object: string,
  array: string
  background: string,
  scrollbar: string,
  scrollbarThumb: string
}

const createJSONTheme = (colors: ThemeColors) => {
  return styled.div`
    .renderjson {
      margin: 0;
      padding: 30px;
      max-width: 100%;
      border-radius: 3px;
      background: ${colors.background};
      overflow-x: scroll;
      -webkit-overscroll-scrolling: auto;
    }

    .renderjson::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 4px;
    }
    .renderjson::-webkit-scrollbar-corner,
    .renderjson::-webkit-scrollbar {
      background-color: ${colors.scrollbar};
    }


    .renderjson::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: ${colors.scrollbarThumb};
      box-shadow: 0 0 1px #8f416e;
      /* border: 1px solid #6272a4; */
      width: 20px;
    }

    .renderjson a              { text-decoration: none;
                                color: ${colors.a}; }
    .renderjson .disclosure    { color: ${colors.disclosure};
                                font-size: 120%; }
    .renderjson .syntax        { color: ${colors.syntax}; }
    .renderjson .string        { color: ${colors.string}; }
    .renderjson .number        { color: ${colors.number}; }
    .renderjson .boolean       { color: ${colors.boolean}; }
    .renderjson .key           { color: ${colors.key}; }
    .renderjson .keyword       { color: ${colors.keyword}; }
    .renderjson .object.syntax { color: ${colors.object}; }
    .renderjson .array.syntax  { color: ${colors.array}; }
  `
}

export const JSONThemes = {
  dracula: createJSONTheme({
    a: '#6272a4',
    disclosure: '#6272a4',
    syntax: '#ff79c6',
    string: '#8be9fd',
    number: '#f1fa8c',
    boolean: '#bd93f9',
    key: '#f8f8f2',
    keyword: '#f8f8f2',
    object: '#ff5555',
    array: '#f1fa8c',
    background: '#282a36',
    scrollbar: '#6272a4',
    scrollbarThumb: '#ff79c6'
  }),
  default: createJSONTheme({
    a: Colors.alternate,
    disclosure: Colors.highlight,
    syntax: Colors.highlight,
    string: Colors.text,
    number: Colors.highlight,
    boolean: Colors.alternate,
    key: Colors.unselected,
    keyword: Colors.highlight,
    object: Colors.alternate,
    array: Colors.alternate,
    background: Colors.darkerPage,
    scrollbar: Colors.lighter,
    scrollbarThumb: Colors.alternate
  }),
}


export const ThemedTabColors: TabColors = {
  bg: Colors.bg,
  text: Colors.text,
  highlight: Colors.highlight,
  unselected: Colors.unselected,
  lighter: Colors.lighter,
}

export const ThemedTab = styled(StyledTab)`
  font-family: ${Fonts.sans};
`

export const ThemedTabPanel = styled(StyledTabPanel)`
  margin-bottom: 60px;
`

export const ThemedTabNav = styled(StyledTabNav)`
  width: 70vw;

  @media screen and (max-width: 1200px) {
    width: 80vw;
  }

  @media screen and (max-width: 900px) {
    width: 100vw;
  }
`

export const ThemedTabNavList = styled(StyledTabNavList)`
  width: 70vw;

  @media screen and (max-width: 1200px) {
    width: 80vw;
  }

  @media screen and (max-width: 900px) {
    width: 100vw;
  }
`

export const ThemedTabContent = styled(StyledTabContent)`
  width: 70vw;
  overflow: auto;

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
