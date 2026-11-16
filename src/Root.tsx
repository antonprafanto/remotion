import type {FC} from 'react';
import {Composition, Still} from 'remotion';
import {FPS, H, W} from './brand/theme';
import {CahayaMatahari, timeline as cahayaMatahari} from './videos/cahaya-matahari/CahayaMatahari';
import {CahayaMatahariCover} from './videos/cahaya-matahari/Cover';
import {KertasA4Cover} from './videos/kertas-a4/Cover';
import {KertasA4, timeline as kertasA4} from './videos/kertas-a4/KertasA4';

export const RemotionRoot: FC = () => (
	<>
		<Composition
			id="KertasA4"
			component={KertasA4}
			durationInFrames={kertasA4.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="KertasA4Cover" component={KertasA4Cover} width={W} height={H} />

		<Composition
			id="CahayaMatahari"
			component={CahayaMatahari}
			durationInFrames={cahayaMatahari.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="CahayaMatahariCover" component={CahayaMatahariCover} width={W} height={H} />
	</>
);
