import React from 'react';
import { render } from 'wrappedTestingLibrary';

import { ScratchpadProvider } from 'providers/ScratchpadProvider';
import Scratchpad from './Scratchpad';

describe('<Scratchpad />', () => {
  it('properly renders', () => {
    const { firstChild } = render(<Scratchpad loginName="scooby-doo" />, { wrapper: ScratchpadProvider });

    expect(firstChild).toMatchSnapshot();
  });
});
