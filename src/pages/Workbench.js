import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import CallMadeIcon from '@mui/icons-material/CallMade';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import FunctionsIcon from '@mui/icons-material/Functions';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

import Home from '../modules/home';
import MetricsManagement from '../modules/metrics_management';
import AdHoc from '../modules/multi_dimensional_analysis/ad_hoc';
import DataVisualization from '../modules/multi_dimensional_analysis/data_visualization';
import Dimension from '../modules/multi_dimensional_model_management/dimension';
import CubeDimensionMatrix from '../modules/multi_dimensional_model_management/CubeDimensionMatrix';
import UploadMeta from '../modules/multi_dimensional_model_management/UploadMeta';

const NAVIGATION = [
    {
        segment: 'home',
        title: 'Home',
        icon: <HomeIcon />,
    },
    {
        segment: 'multi_dimensional_model_management',
        title: '模型管理',
        icon: <GridViewIcon />,
        children: [
            {
                segment: 'dimension',
                title: '维度',
                icon: <CallMadeIcon />,
            },
            {
                segment: 'cube_dimension_matrix',
                title: '模型概览',
                icon: <ViewInArIcon />,
            },
            {
                segment: 'UploadMeta',
                title: '导入模型',
                icon: <UploadFileIcon />,
            },
        ],
    },
    {
        segment: 'multi_dimensional_analysis',
        title: '多维分析',
        icon: <StarPurple500Icon />,
        children: [
            {
                segment: 'ad_hoc',
                title: '即席查询',
                icon: <PivotTableChartIcon />,
            },
            {
                segment: 'data_visualization',
                title: '数据可视化',
                icon: <EqualizerIcon />,
            },
        ],
    },
    {
        segment: 'metrics_management',
        title: '指标管理',
        icon: <FunctionsIcon />,
    },
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent({ pathname }) {
    return (
        <Box
            sx={{
                // py: 4,
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                textAlign: 'left',
            }}
        >
            <Typography>{pathname}</Typography>
        </Box>
    );
}

DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
    const { window } = props;

    // const router = useDemoRouter('/home');
    const router = useDemoRouter('/multi_dimensional_model_management/cube_dimension_matrix');

    // Remove this const when copying and pasting into your project.
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        // preview-start
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{
                title: 'Euclid OLAP',
            }}
        >
            <DashboardLayout>
                {/* <DemoPageContent pathname={router.pathname} /> */}
                {/* <Box>operating area - {router.pathname}</Box> */}
                {(() => {
                    switch (router.pathname) {
                        case '/home':
                            return <Home />;
                        case '/multi_dimensional_model_management/dimension':
                            return <Dimension />;
                        case '/multi_dimensional_model_management/cube_dimension_matrix':
                            return <CubeDimensionMatrix />;
                        case '/multi_dimensional_model_management/UploadMeta':
                            return <UploadMeta />;
                        case '/multi_dimensional_analysis/ad_hoc':
                            return <AdHoc />;
                        case '/multi_dimensional_analysis/data_visualization':
                            return <DataVisualization />;
                        case '/metrics_management':
                            return <MetricsManagement />;
                        default:
                            return <Typography>404 - Page not found</Typography>;  // 默认情况
                    }
                })()}
            </DashboardLayout>
        </AppProvider>
        // preview-end
    );
}

DashboardLayoutBasic.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};

export default DashboardLayoutBasic;
