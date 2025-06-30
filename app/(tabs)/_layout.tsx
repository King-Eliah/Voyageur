import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, Search, MapPin, Calendar, User } from 'lucide-react-native';
import { Platform, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function TabLayout() {
  const { colors } = useTheme();
  
  // Smart device detection
  const isTablet = screenWidth >= 768;
  const isSmallPhone = screenWidth < 375;
  const hasNotch = screenHeight >= 812; // iPhone X+ detection
  
  // Dynamic measurements
  const iconSize = isTablet ? 28 : isSmallPhone ? 22 : 25;
  const fontSize = isTablet ? 13 : isSmallPhone ? 10 : 11;
  
  const tabBarHeight = Platform.select({
    ios: hasNotch ? 90 : isSmallPhone ? 75 : 80,
    android: isTablet ? 70 : 65,
    default: 70
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          paddingBottom: Platform.select({
            ios: hasNotch ? 25 : 10,
            android: isTablet ? 12 : 8,
            default: 10
          }),
          paddingTop: 12,
          paddingHorizontal: isTablet ? 20 : 8,
          height: tabBarHeight,
          
        //shadow
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
            android: {
              elevation: 12,
            },
            default: {}
          }),
          
          // For transparency, use rgba color if needed
          // backgroundColor: 'rgba(255, 255, 255, 0.96)' // example
        },
        
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        
        tabBarLabelStyle: {
          fontSize: fontSize,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.1,
          fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto-Medium',
            default: undefined
          }),
        },
        
        tabBarIconStyle: {
          marginBottom: 1,
        },
        
        tabBarItemStyle: {

          paddingHorizontal: isTablet ? 16 : 4,
          borderRadius: 12,
          marginHorizontal: 2,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 50,
        },
        
        tabBarBackground: () => null,
        tabBarHideOnKeyboard: Platform.OS === 'android',
      }}>
      
 
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={iconSize} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Search 
              size={iconSize} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="trips"
        options={{
          title: isTablet ? 'My Trips' : 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <MapPin 
              size={iconSize} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <Calendar 
              size={iconSize} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={iconSize} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
      />
    </Tabs>
  );
}