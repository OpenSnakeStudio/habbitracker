import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { ShopReward, PurchasedReward } from '@/hooks/useRewardsShop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Snowflake, Percent, ShoppingBag, CheckCircle, Gift, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface RewardsShopTabProps {
  rewards: ShopReward[];
  purchasedRewards: PurchasedReward[];
  loading: boolean;
  userStars: number;
  purchaseReward: (rewardId: string) => Promise<boolean>;
  useReward: (purchasedRewardId: string) => Promise<boolean>;
  getUnusedRewards: () => PurchasedReward[];
}

export function RewardsShopTab({
  rewards,
  purchasedRewards,
  loading,
  userStars,
  purchaseReward,
  useReward,
  getUnusedRewards
}: RewardsShopTabProps) {
  const { language } = useTranslation();
  const isRussian = language === 'ru';

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'freeze': return <Snowflake className="h-8 w-8 text-blue-500" />;
      case 'pro_discount': return <Percent className="h-8 w-8 text-green-500" />;
      case 'theme': return <Palette className="h-8 w-8 text-purple-500" />;
      default: return <Gift className="h-8 w-8 text-primary" />;
    }
  };

  const unusedRewards = getUnusedRewards();

  return (
    <div className="space-y-4">
      {/* Stars balance */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{userStars}</p>
                <p className="text-xs text-muted-foreground">{isRussian ? 'Ваши звёзды' : 'Your stars'}</p>
              </div>
            </div>
            {unusedRewards.length > 0 && (
              <Badge variant="default">
                {unusedRewards.length} {isRussian ? 'доступно' : 'available'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="shop">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="shop">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isRussian ? 'Магазин' : 'Shop'}
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Gift className="h-4 w-4 mr-2" />
            {isRussian ? 'Мои награды' : 'My Rewards'}
            {unusedRewards.length > 0 && (
              <Badge variant="secondary" className="ml-2">{unusedRewards.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-4">
          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {rewards.map((reward, index) => {
                const canAfford = userStars >= reward.price_stars;
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={!canAfford ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            {getRewardIcon(reward.reward_type)}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{reward.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {reward.description}
                            </p>
                            
                            {reward.reward_type === 'freeze' && (
                              <Badge variant="outline" className="mt-2">
                                {isRussian ? '1 раз в месяц' : 'Once per month'}
                              </Badge>
                            )}
                            {reward.reward_type === 'theme' && (
                              <Badge variant="outline" className="mt-2 bg-purple-500/10">
                                <Palette className="h-3 w-3 mr-1" />
                                {isRussian ? 'Тема оформления' : 'Custom Theme'}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold mb-2">
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              {reward.price_stars}
                            </div>
                            
                            <Button
                              size="sm"
                              disabled={!canAfford}
                              onClick={() => purchaseReward(reward.id)}
                            >
                              {isRussian ? 'Купить' : 'Buy'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {rewards.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isRussian ? 'Магазин пока пуст' : 'Shop is empty'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <div className="space-y-4">
            {purchasedRewards.length > 0 ? (
              purchasedRewards.map((pr, index) => (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={pr.is_used ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {pr.reward && getRewardIcon(pr.reward.reward_type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{pr.reward?.name}</h3>
                            {pr.is_used ? (
                              <Badge variant="secondary">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {isRussian ? 'Использовано' : 'Used'}
                              </Badge>
                            ) : (
                              <Badge variant="default">
                                {isRussian ? 'Доступно' : 'Available'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(pr.created_at), 'dd MMM yyyy', { locale: ru })}
                          </p>
                        </div>
                        
                        {!pr.is_used && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => useReward(pr.id)}
                          >
                            {isRussian ? 'Использовать' : 'Use'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isRussian ? 'У вас пока нет наград' : 'No rewards yet'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRussian ? 'Заработайте звёзды и купите награды!' : 'Earn stars and buy rewards!'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
