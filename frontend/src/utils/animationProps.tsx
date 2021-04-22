import React, { FC, CSSProperties } from "react";
import { Transition, motion } from "framer-motion";
import { alwaysChanging } from "./utils";

export type PositionProp = "static" | "absolute" | "initial" | "inherit" | "-moz-initial" | "revert" | "unset" | "-webkit-sticky" | "fixed" | "relative" | "sticky" | undefined;

const time = 0.25; // 0.15
const dist = 2;
const dx100em = [(dist * -1) + 'em', 0, dist + 'em'];
const dx50em = [(dist * 0.5 * -1) + 'em', 0, (dist * 0.5) + 'em'];
// ease:
// "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate"

const transition: Transition = {
    ease: 'circOut', //staggerChildren: 0,
    duration: time,
};


// Page switch
export const animProps = {
    transition: transition,
    initial: { opacity: 0, x: dx100em[0], position: 'static' as PositionProp },
    animate: { opacity: 1, x: dx100em[1], position: 'static' as PositionProp },
    exit: { opacity: 0, x: dx100em[2], position: 'absolute' as PositionProp, width: 'auto' },
};

export const animProps_span_searchResult = {
    transition: { ease: 'circOut', duration: 0.2 },
    initial: { opacity: 0, x: dx100em[0] },
    animate: { opacity: 1, x: dx100em[1] },
    exit: { opacity: 0, x: dx50em[2] },
};

export const animProps_span_messagesStatus = {
    initial: {
        opacity: 0,
        x: 0,
        display: 'inline-block'
    },
    animate: {
        opacity: 1,
        x: dx100em[1],
        transition: {
            ease: 'easeOut',
            duration: 0,
            delay: 0
        },
    },
    exit: {
        opacity: 0,
        x: dx100em[2],
        transition: {
            ease: 'easeOut',
            duration: 0.35,
            delay: 0.9
        }
    },
};

export const animProps_radioOptionGroup = {
    transition: transition,
    initial: { opacity: 0, y: '-1em', height: 0, marginTop: 0 },
    animate: { opacity: 1, y: '0em', height: 'auto' },
    exit: { opacity: 0, y: '0em', height: 0, marginTop: 0 },
};

export const animProps_modalPage = {
    transition: { ease: 'easeOut', duration: 0.3 },
    initial: { opacity: 0, x: '1em', height: 'auto' }, // , position: 'relative' as PositionProp
    animate: { opacity: 1, x: '0em', height: 'auto' },
    exit: { opacity: 0, x: '-1em', height: 'auto', },
};


export const MotionAlways: FC = (p: { children?: React.ReactNode, style?: CSSProperties }) =>
    <motion.div key={alwaysChanging()} {...animProps} style={p.style} >
        {p.children}
    </motion.div>;

export const MotionDiv: FC<{ identityKey?: any, positionTransition?: boolean, layoutTransition?: boolean, animProps?: any, style?: CSSProperties, className?: string }> = (p) =>
    <motion.div className={p.className} key={p.identityKey} positionTransition={p.positionTransition} layoutTransition={p.layoutTransition} style={p.style} {...(p.animProps ?? animProps)} >
        {p.children}
    </motion.div>;

export const MotionSpan: FC<{ identityKey?: any, overrideAnimProps?: any, style?: CSSProperties }> = (p) =>
    <motion.span key={p.identityKey} style={p.style} {...(p.overrideAnimProps ?? animProps)}>
        {p.children}
    </motion.span>;

/*


@observer
class AnimationExample extends Component<{}> {
    @observable counter = 0;
    @observable random = 0;

    obj = [
        '#f6d8aeff',
        '#2e4057ff',
        '#083d77ff',
        '#da4167ff',
        '#f4d35eff',

        '#264653ff',
        '#2a9d8fff',
        '#e9c46aff',
        '#f4a261ff',
        '#e76f51ff',

    ];

    tick = () => transaction(() => {

        this.counter++;
        this.random = Math.random();
        console.log('tick', this.counter);
    });

    constructor(p: any) {
        super(p);
        // setInterval(this.tick, 3000);
    }

    render() {
        // const index = Math.round(this.random * (this.obj.length - 1));
        const index = this.counter;
        const entry = this.obj[index % this.obj.length];

        const fw = (((this.random - 0.5) * 0.25) + 1);
        const fh = (((this.random - 0.5) * 0.5) + 1);
        let w = (400 * fw) + 'px';
        let h = (250 * fh) + 'px';

        // w = '400px';
        // h = '250px';

        return <div style={{ background: '#DDD' }}>
            <button onClick={this.tick}>tick</button>

            <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                <div>some text before </div>

                <ReactCSSTransitionReplace transitionName="crossFade"
                    changeWidth={true}
                    overflowHidden={false}
                    transitionEnterTimeout={400}
                    transitionLeaveTimeout={400}
                >

                    <div key={entry}>
                        <div style={{
                            width: w, height: h,
                            display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
                            borderRadius: '3px', border: '1px solid hsla(0deg, 0%, 0%, 0.08)',
                            background: entry,

                            color: 'white',
                            textShadow: '0 0 5px black',
                            fontFamily: 'Inter'
                        }}>
                            <span style={{ fontSize: '130%', fontWeight: 'bold' }}>{entry}</span>
                            <br />
                            <span>Index {index}</span>
                        </div>
                    </div>

                </ReactCSSTransitionReplace>
                <div>
                    some text here
            </div>
            </div>
        </div>


    }
}
*/