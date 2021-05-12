import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { ShortPolling } from './components/ShortPolling/ShortPolling';
import { LongPolling } from './components/LongPolling/LongPolling';
import { ServerSentEvents } from './components/ServerSentEvents/ServerSentEvents';
import { WebSockets } from './components/WebSockets/WebSockets';

import './App.scss';


function App() {
  return (
    <div className="app">
      <Tabs>
        <TabList>
          <Tab>Short polling</Tab>
          <Tab>Long polling</Tab>
          <Tab>Server-sent events</Tab>
          <Tab>Web sockets</Tab>
        </TabList>

        <TabPanel>
          <ShortPolling />
        </TabPanel>
        <TabPanel>
          <LongPolling />
        </TabPanel>
        <TabPanel>
          <ServerSentEvents />
        </TabPanel>
        <TabPanel>
          <WebSockets />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
