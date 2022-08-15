import React, { useState, useEffect } from 'react';


export function Container() {
    return (
        <div>
            <div>
                <Location />
                <DayDisplay />
            </div>
            <div>
                <DayDisplay />
            </div>
            <div>
                <Graph />
            </div>
        </div>
    )
}