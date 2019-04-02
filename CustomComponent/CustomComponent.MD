#Custom Component
Is a solution to resolve problem with custom header
```JS
import { CustomComponent } from 'react-navigation-collapsible';

// USE
class Settings extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            header: prop => ( // This didn't workout
                <CustomComponent {...prop}>
                                <Nav
                                    title="Settings"
                                    navigation={navigation}
                                    onPressRight={params.handleLogout}
                                    rightName="Log out"
                                    leftIcon={{
                                        type: 'ionicon',
                                        name: 'md-list',
                                        size: 26,
                                    }}
                                />
                </CustomComponent>
            )
        }
    }
...
```
