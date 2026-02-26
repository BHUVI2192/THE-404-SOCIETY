import React from 'react';
import { Helmet } from 'react-helmet-async';
import SpatialNexus from '../components/SpatialNexus';

export default function Community() {
    return (
        <>
            <Helmet>
                <title>Core Team & Leaders | The 404 Society</title>
                <meta name="description" content="Meet the core operations and technical leaders driving The 404 Society at PESITM." />
            </Helmet>
            <SpatialNexus />
        </>
    );
}
