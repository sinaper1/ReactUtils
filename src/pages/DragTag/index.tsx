import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Left from './Left';
import Right from './Right';
import './index.less';
const Index = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={'content'}>
                <Left/>
                <Right/>
            </div>
        </DndProvider>
    );
};
export default Index;